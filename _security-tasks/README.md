# Tareas de Seguridad — aini28-v2

Backlog derivado del análisis de seguridad. Solo incluye hallazgos de prioridad **ALTA** y **MEDIA**.
Los hallazgos CRÍTICOS (rotar token de Sanity y app-password de Gmail) se gestionan manualmente fuera de este backlog.

## Índice

| # | Prioridad | Tarea | Estado | Archivo |
|---|-----------|-------|--------|---------|
| 1 | 🟠 ALTA | Rate limiting + CAPTCHA en endpoints de correo | ✅ Completada | [SEC-01-endpoints-correo-abiertos.md](./SEC-01-endpoints-correo-abiertos.md) |
| 2 | 🟠 ALTA | Validación de entrada con Zod en rutas API | ✅ Completada | [SEC-02-validacion-zod.md](./SEC-02-validacion-zod.md) |
| 3 | 🟡 MEDIA | Revisar/restringir `dangerouslyAllowSVG` | ✅ Completada | [SEC-03-svg-inseguro.md](./SEC-03-svg-inseguro.md) |
| 4 | 🟡 MEDIA | Añadir Content-Security-Policy y limpiar headers obsoletos | ✅ Completada | [SEC-04-csp-headers.md](./SEC-04-csp-headers.md) |
| 5 | 🟡 MEDIA | Escapar JSON-LD en componentes de SEO | ✅ Completada | [SEC-05-jsonld-escape.md](./SEC-05-jsonld-escape.md) |

## Leyenda de estado
- ⬜ Pendiente
- 🔄 En progreso
- ✅ Completada
