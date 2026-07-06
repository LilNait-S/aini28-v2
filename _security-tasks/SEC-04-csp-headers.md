# SEC-04 — Falta Content-Security-Policy y headers obsoletos

- **Prioridad:** 🟡 MEDIA
- **Estado:** ✅ Completada
- **Archivos afectados:** `middleware.ts`, `next.config.ts`

## Problema
Se configuran `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, etc., pero
**no hay una Content-Security-Policy** para las páginas, que es la defensa efectiva contra XSS.
Además `X-XSS-Protection` está **obsoleto** (ignorado por navegadores modernos).

## Impacto
- Menor defensa en profundidad frente a XSS e inyección de recursos.

## Solución propuesta
- Añadir una cabecera `Content-Security-Policy` adecuada (permitir Sanity CDN, estilos/scripts
  necesarios de Next.js). Empezar en modo `Report-Only` para no romper el sitio.
- Eliminar `X-XSS-Protection` (obsoleto) o dejarlo documentado como no-op.
- Considerar `Strict-Transport-Security` (HSTS) en producción.

## Criterios de aceptación
- [x] Cabecera CSP presente en las respuestas de página (`Content-Security-Policy-Report-Only`).
- [x] El sitio funciona sin bloqueos (Report-Only: solo registra violaciones).
- [x] Headers obsoletos revisados (`X-XSS-Protection` eliminado de `middleware.ts` y `next.config.ts`).
- [x] HSTS añadido en producción.

## Implementación
- `middleware.ts`: `buildCsp()` genera la política. Directivas: `default-src 'self'`, `script-src`/`style-src` con `'unsafe-inline'` (Next.js inyecta scripts inline + JSON-LD; `'unsafe-eval'` solo en dev), `img-src` con `cdn.sanity.io`, `connect-src` con `*.sanity.io`, WebSocket y el backend (`NEXT_PUBLIC_BACKEND_BASE_PATH`), `frame-ancestors 'none'`, `base-uri`/`form-action 'self'`, `object-src 'none'`.
- Se emite como **`Content-Security-Policy-Report-Only`** para no romper el sitio hasta validar en producción.
- `Strict-Transport-Security` (1 año, includeSubDomains) solo en producción.
- Eliminado `X-XSS-Protection` (obsoleto) de ambos archivos.

## Pendiente (mejora futura)
1. Revisar en producción que no haya violaciones legítimas en la consola/reportes.
2. Cambiar la cabecera de `Content-Security-Policy-Report-Only` a `Content-Security-Policy` para **aplicarla**.
3. Opcional endurecer: migrar de `'unsafe-inline'` a **nonces** por petición (requiere generar nonce en middleware y propagarlo a scripts inline, incl. JSON-LD de SEC-05).
