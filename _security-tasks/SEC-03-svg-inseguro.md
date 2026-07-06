# SEC-03 — `dangerouslyAllowSVG: true` en la configuración de imágenes

- **Prioridad:** 🟡 MEDIA
- **Estado:** ✅ Completada
- **Archivos afectados:** `next.config.ts`

## Problema
El optimizador de imágenes tiene `dangerouslyAllowSVG: true`. Los SVG pueden contener scripts.
Está **parcialmente mitigado** por `contentDispositionType: "attachment"` y el
`contentSecurityPolicy` del bloque de imágenes, pero sigue siendo superficie de riesgo si en
algún momento se sirven SVGs subidos por usuarios.

## Impacto
- Posible XSS a través de SVG malicioso si se relaja la mitigación o se sirven SVGs no confiables.

## Solución propuesta
- Si no se necesitan SVG remotos, poner `dangerouslyAllowSVG: false`.
- Si se necesitan, confirmar que las mitigaciones (`contentDispositionType`, CSP) permanecen y
  que solo provienen de fuentes confiables (Sanity CDN).

## Criterios de aceptación
- [x] Decisión documentada: **SVG desactivado** (`dangerouslyAllowSVG: false`).
- [x] Las imágenes del sitio siguen renderizando correctamente.

## Implementación
Análisis de uso de SVG:
- SVG locales (`/placeholder.svg`, etc.) se renderizan con `<img>` plano → **no** pasan por el optimizador de `next/image`, así que no requieren el flag.
- El logo en `organization-schema.tsx` es solo una URL en el JSON-LD, no una imagen optimizada.
- Imágenes remotas: `remotePatterns` solo permite `cdn.sanity.io`, que entrega formatos rasterizados (webp/jpg/png), no SVG.

Conclusión: el optimizador nunca necesita procesar SVG → se estableció `dangerouslyAllowSVG: false`. Se mantienen `contentDispositionType: "attachment"` y el `contentSecurityPolicy` del bloque de imágenes como defensa en profundidad por si se reactiva en el futuro.
