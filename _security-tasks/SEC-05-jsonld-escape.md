# SEC-05 — JSON-LD sin escapar en componentes de SEO

- **Prioridad:** 🟡 MEDIA
- **Estado:** ✅ Completada
- **Archivos afectados:** `components/seo/product-schema.tsx`, `components/seo/organization-schema.tsx`
- **Archivos nuevos:** `lib/seo/json-ld.ts`

## Problema
Ambos componentes inyectan `JSON.stringify(schema)` con `dangerouslySetInnerHTML` sin escapar.
Si el contenido del CMS contiene la secuencia `</script>`, se puede cerrar la etiqueta e
inyectar HTML/JS (XSS). Riesgo **bajo-medio** porque el contenido proviene de Sanity
(controlado por administradores), pero es una mala práctica.

## Impacto
- XSS potencial si un valor del CMS contiene `</script>` u otras secuencias de ruptura.

## Solución propuesta
- Escapar la salida antes de inyectarla, reemplazando al menos `<` por `<`
  (y opcionalmente `>` y `&`), o usar una utilidad de serialización segura para JSON-LD.
- Centralizar el escape en un helper reutilizable para ambos componentes.

## Criterios de aceptación
- [x] `</script>` en un campo del CMS no rompe la página ni ejecuta código (probado: se serializa como `</script>`).
- [x] El JSON-LD sigue siendo válido (`JSON.parse` recupera el valor original; los navegadores decodifican `<` → `<`).

## Implementación
- `lib/seo/json-ld.ts`: helper `safeJsonLd()` que serializa con `JSON.stringify` y escapa `<`, `>`, `&` a `</>/&`, más `U+2028`/`U+2029`.
  - El regex de separadores se construye con `String.fromCharCode` para no incluir esos caracteres crudos en el fuente (donde actúan como fin de línea).
- `product-schema.tsx` y `organization-schema.tsx`: `JSON.stringify(schema)` → `safeJsonLd(schema)` en el `dangerouslySetInnerHTML`.
- Verificado: sin otros `dangerouslySetInnerHTML` sin escapar en el proyecto; `tsc` limpio; prueba funcional del escape sobre payload malicioso pasa.
