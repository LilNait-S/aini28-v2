# SEC-02 — Falta validación de entrada en rutas API (usar Zod)

- **Prioridad:** 🟠 ALTA
- **Estado:** ✅ Completada
- **Archivos afectados:** `app/api/send-email/route.ts`, `app/api/send-claim/route.ts`, `lib/validations/claims-book.ts`
- **Archivos nuevos:** `lib/validations/order.ts`

## Problema
Las rutas hacen `(await req.json()) as OrderPayload` / `as ClaimsBookPayload`. El `as` es solo
un cast de TypeScript: **no valida nada en runtime**. Un payload malformado o malicioso puede
romper el render del email o inyectar contenido inesperado.

## Impacto
- Errores no controlados / caídas del endpoint.
- Datos no confiables usados directamente en el render del correo.

## Solución propuesta
- Definir esquemas Zod para `OrderPayload` y `ClaimsBookPayload` (ya existe `zod` en el proyecto).
- Validar con `schema.safeParse(body)` al inicio del handler.
- Devolver `400` con detalle mínimo si la validación falla.

## Criterios de aceptación
- [x] Payload inválido devuelve `400` sin ejecutar el envío.
- [x] JSON malformado devuelve `400`.
- [x] Payload válido se procesa normalmente.
- [x] Los tipos derivan del esquema Zod (`z.infer`) para mantener una única fuente de verdad.

## Implementación
- `lib/validations/order.ts`: `orderPayloadSchema` (valida `userDetails` con `customerContactSchema` + `cartItems` con `cartItemSchema`, límites de qty/precio/longitud, 1–200 ítems).
- `lib/validations/claims-book.ts`: nuevo `claimsBookApiSchema` que hace `z.coerce.date()` sobre `fecha` (llega como string en JSON).
- Ambas rutas: `req.json()` en try/catch → `guardMailRequest` (body crudo, para leer `captchaToken`) → `schema.safeParse(body)` → `400` si falla.
- El `as OrderPayload` / `as ClaimsBookPayload` fue reemplazado por datos validados (`parsed.data`).
