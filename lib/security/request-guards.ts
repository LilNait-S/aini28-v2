import "server-only"

import { NextRequest, NextResponse } from "next/server"
import { rateLimit } from "./rate-limit"
import { verifyCaptcha } from "./captcha"

/** Orígenes permitidos para peticiones a los endpoints de correo. */
const ALLOWED_ORIGINS = new Set(
  [
    "https://aini28.com",
    "https://www.aini28.com",
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NODE_ENV !== "production" ? "http://localhost:3000" : undefined,
  ].filter(Boolean) as string[]
)

/** Tamaño máximo aceptado del cuerpo de la petición (bytes). */
const MAX_BODY_BYTES = 50 * 1024 // 50 KB

/** Extrae la IP del cliente respetando cabeceras de proxy comunes. */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0]!.trim()
  return req.headers.get("x-real-ip") ?? "unknown"
}

/**
 * Verifica que la petición provenga de un origen permitido (defensa CSRF/abuso).
 * Comprueba Origin y, como respaldo, Referer.
 */
export function verifyOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin")
  if (origin) return ALLOWED_ORIGINS.has(origin)

  const referer = req.headers.get("referer")
  if (referer) {
    try {
      return ALLOWED_ORIGINS.has(new URL(referer).origin)
    } catch {
      return false
    }
  }

  // Sin Origin ni Referer no podemos verificar el origen: rechazar.
  return false
}

/** Comprueba el límite de tamaño declarado en Content-Length. */
export function exceedsMaxBody(req: NextRequest): boolean {
  const len = Number(req.headers.get("content-length") ?? "0")
  return Number.isFinite(len) && len > MAX_BODY_BYTES
}

type GuardOptions = {
  /** Nombre de la ruta, usado como parte de la clave de rate limit. */
  routeId: string
  limit?: number
  windowMs?: number
}

/**
 * Ejecuta las comprobaciones comunes de seguridad para un endpoint público de correo:
 * origen, tamaño de cuerpo, rate limit por IP y CAPTCHA (si está configurado).
 *
 * Devuelve una `NextResponse` de error si alguna comprobación falla, o `null` si
 * la petición puede continuar. El cuerpo JSON ya parseado se pasa para poder leer
 * el token de CAPTCHA sin volver a consumir el stream.
 */
export async function guardMailRequest(
  req: NextRequest,
  body: unknown,
  { routeId, limit = 5, windowMs = 60_000 }: GuardOptions
): Promise<NextResponse | null> {
  // 1. Verificación de origen (anti-CSRF / anti-abuso desde terceros).
  if (!verifyOrigin(req)) {
    return NextResponse.json({ message: "Origen no permitido" }, { status: 403 })
  }

  // 2. Límite de tamaño de payload.
  if (exceedsMaxBody(req)) {
    return NextResponse.json({ message: "Payload demasiado grande" }, { status: 413 })
  }

  // 3. Rate limiting por IP.
  const ip = getClientIp(req)
  const result = await rateLimit(`${routeId}:${ip}`, { limit, windowMs })
  if (!result.success) {
    return NextResponse.json(
      { message: "Demasiadas solicitudes. Intenta más tarde." },
      { status: 429, headers: { "Retry-After": String(result.retryAfter) } }
    )
  }

  // 4. CAPTCHA (solo se exige si TURNSTILE_SECRET_KEY está configurado).
  const captchaToken =
    body && typeof body === "object" && "captchaToken" in body
      ? String((body as Record<string, unknown>).captchaToken ?? "")
      : ""
  const captchaOk = await verifyCaptcha(captchaToken, ip)
  if (!captchaOk) {
    return NextResponse.json(
      { message: "Verificación anti-bot fallida" },
      { status: 403 }
    )
  }

  return null
}
