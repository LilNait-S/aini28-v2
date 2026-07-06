import "server-only"

import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

/**
 * Rate limiter con dos backends:
 *
 * 1. Upstash Redis (recomendado en Vercel/serverless): contador compartido entre
 *    todas las instancias. Se activa automáticamente si están definidas
 *    UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN.
 * 2. Fallback en memoria (desarrollo local / single-instance): el estado vive en
 *    el proceso, por lo que NO es fiable en serverless.
 */

export type RateLimitResult = {
  success: boolean
  limit: number
  remaining: number
  /** Segundos hasta que la ventana se reinicia (para cabecera Retry-After). */
  retryAfter: number
}

// La integración de Upstash en Vercel crea variables con prefijo KV_*; en local
// o con la CLI de Upstash suelen llamarse UPSTASH_REDIS_REST_*. Soportamos ambas.
const redisUrl =
  process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
const redisToken =
  process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN

const hasUpstash = !!redisUrl && !!redisToken

// --- Backend Upstash ---------------------------------------------------------

// Cache de limitadores por configuración (limit+windowMs) para reutilizar conexión.
const upstashLimiters = new Map<string, Ratelimit>()

function getUpstashLimiter(limit: number, windowMs: number): Ratelimit {
  const cacheKey = `${limit}:${windowMs}`
  let limiter = upstashLimiters.get(cacheKey)
  if (!limiter) {
    limiter = new Ratelimit({
      redis: new Redis({ url: redisUrl!, token: redisToken! }),
      limiter: Ratelimit.slidingWindow(limit, `${windowMs} ms`),
      prefix: "aini28:rl",
    })
    upstashLimiters.set(cacheKey, limiter)
  }
  return limiter
}

// --- Backend en memoria ------------------------------------------------------

type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

function sweep(now: number) {
  if (buckets.size < 5000) return
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

function memoryRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  sweep(now)
  const existing = buckets.get(key)

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true, limit, remaining: limit - 1, retryAfter: 0 }
  }

  existing.count += 1
  if (existing.count > limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      retryAfter: Math.ceil((existing.resetAt - now) / 1000),
    }
  }
  return {
    success: true,
    limit,
    remaining: limit - existing.count,
    retryAfter: 0,
  }
}

// --- API pública -------------------------------------------------------------

/**
 * Aplica un límite de `limit` peticiones cada `windowMs` milisegundos para `key`.
 * Usa Upstash si está configurado; si no, cae al limitador en memoria.
 */
export async function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): Promise<RateLimitResult> {
  if (hasUpstash) {
    const { success, limit: lim, remaining, reset } = await getUpstashLimiter(
      limit,
      windowMs
    ).limit(key)
    return {
      success,
      limit: lim,
      remaining,
      retryAfter: success ? 0 : Math.max(0, Math.ceil((reset - Date.now()) / 1000)),
    }
  }

  return memoryRateLimit(key, limit, windowMs)
}
