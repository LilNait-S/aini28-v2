# SEC-01 — Endpoints de correo abiertos (relay de spam / email bombing)

- **Prioridad:** 🟠 ALTA
- **Estado:** ✅ Completada
- **Archivos afectados:** `app/api/send-email/route.ts`, `app/api/send-claim/route.ts`
- **Archivos nuevos:** `lib/security/rate-limit.ts`, `lib/security/request-guards.ts`, `lib/security/captcha.ts`

## Problema
Ambos endpoints POST no tienen autenticación, rate limiting ni CAPTCHA. Cualquiera puede
invocarlos en bucle. En `send-email`, el correo de confirmación se envía a
`payload.userDetails.email` (controlado por el atacante), lo que permite usar la cuenta de
Gmail como **relay de spam a destinatarios arbitrarios** y arriesga la suspensión de la cuenta.

## Impacto
- Envío masivo de correos / email bombing.
- Uso de la cuenta de Gmail como relay hacia terceros.
- Agotamiento de recursos y posible bloqueo/blacklist de la cuenta remitente.

## Solución propuesta
- Añadir **rate limiting por IP** (p. ej. Upstash Ratelimit, o un limitador en memoria/edge).
- Añadir **CAPTCHA** (hCaptcha / Cloudflare Turnstile) en los formularios y verificar el token en el servidor.
- Limitar el tamaño del payload.
- Verificar el origen (Origin/Referer) de la petición.
- Considerar restringir el destinatario de confirmación a un dominio esperado.

## Criterios de aceptación
- [x] Peticiones que superan el límite reciben `429` (5 req/min por IP, con `Retry-After`).
- [x] Peticiones sin CAPTCHA válido son rechazadas *(activo solo si `TURNSTILE_SECRET_KEY` está configurada; ver pendiente abajo)*.
- [x] El envío legítimo desde el formulario sigue funcionando.
- [x] Peticiones de origen no permitido reciben `403`; payloads > 50 KB reciben `413`.

## Implementación
- `lib/security/rate-limit.ts`: limitador en memoria por ventana fija (5 req/60 s por IP). Nota: single-instance; para serverless migrar a Upstash con la misma interfaz.
- `lib/security/request-guards.ts`: `guardMailRequest()` centraliza origen (allowlist), tamaño de cuerpo, rate limit y CAPTCHA.
- `lib/security/captcha.ts`: verificación Cloudflare Turnstile, **inerte** hasta configurar `TURNSTILE_SECRET_KEY`.
- Ambas rutas invocan `guardMailRequest(req, payload, { routeId })` antes de enviar correo.

## Actualización — despliegue en Vercel (implementado)
- **Rate limiter migrado a Upstash Redis** (`lib/security/rate-limit.ts`): usa `@upstash/ratelimit` (sliding window) cuando existen `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN`; si no, cae al limitador en memoria (local). `rateLimit()` pasó a ser `async` y el guard hace `await`.
- **CAPTCHA Turnstile cableado en el frontend**:
  - `components/security/turnstile.tsx`: widget que se renderiza solo si hay `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, entrega el token vía `onToken`.
  - Integrado en checkout (`checkout-form.tsx`) y libro de reclamaciones (`claims-book/page.tsx`): el token viaja como `captchaToken` y el botón se deshabilita hasta pasar el reto (solo si el CAPTCHA está configurado).
  - `middleware.ts`: CSP actualizado con `challenges.cloudflare.com`.

Pasos de activación (crear cuentas + variables en Vercel): ver **SETUP-vercel-ratelimit-captcha.md**.
