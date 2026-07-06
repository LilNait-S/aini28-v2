# Guía de activación — Rate limiting (Upstash) + CAPTCHA (Turnstile) en Vercel

El código ya está implementado. Ambos servicios son **gratuitos** para el tráfico de una tienda normal.
Mientras no configures las variables de entorno, la app funciona igual (rate limit en memoria + sin CAPTCHA).

---

## A. Upstash Redis — rate limiting compartido (importante en Vercel)

Sin esto, el límite de peticiones en Vercel es poco fiable (cada instancia serverless
cuenta por separado). Con Upstash el contador es compartido entre todas las instancias.

### Pasos
1. Entra en https://vercel.com → tu proyecto → pestaña **Storage** → **Marketplace** → **Upstash**
   *(o crea la base directamente en https://upstash.com — plan Free, sin tarjeta).*
2. Crea una base de datos **Redis**. Elige la región más cercana a tus usuarios/deploy.
3. Vercel te ofrece **conectarla al proyecto**; al hacerlo añade solas las variables. Si lo
   creaste en upstash.com, copia manualmente estas dos y pégalas en
   **Vercel → Settings → Environment Variables** (Production y Preview):
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. **Redeploy** el proyecto para que tome las variables.

### Cómo saber que funciona
- En los logs de la función, no hay errores de Redis.
- Si haces >5 peticiones/min al formulario, recibes `429`.
- El limitador detecta las variables automáticamente; si no están, usa memoria local.

---

## B. Cloudflare Turnstile — CAPTCHA anti-bots (gratis e ilimitado)

Frena a los bots que envían el formulario de pedidos/reclamaciones y spamean el Gmail.

### Pasos
1. Crea/inicia cuenta en https://dash.cloudflare.com (gratis; **no** necesitas tener el dominio en Cloudflare).
2. Ve a **Turnstile** → **Add site**:
   - **Domain**: `aini28.com` (y añade `localhost` para pruebas locales).
   - **Widget mode**: *Managed* (recomendado; suele ser invisible).
3. Copia las dos claves que te da:
   - **Site Key** (pública)
   - **Secret Key** (privada)
4. En **Vercel → Settings → Environment Variables** (Production y Preview) añade:
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` = *Site Key*
   - `TURNSTILE_SECRET_KEY` = *Secret Key*
5. **Redeploy**.

### Cómo saber que funciona
- En el formulario de checkout y en el libro de reclamaciones aparece el widget de Turnstile.
- El botón de enviar queda deshabilitado hasta pasar el reto.
- En el servidor, un token ausente/ inválido devuelve `403`.
- Si NO configuras las claves, el widget no aparece y el envío funciona igual que antes.

### Para probar en local
Añade en tu `.env` local (Turnstile ofrece claves de prueba oficiales):
```
NEXT_PUBLIC_TURNSTILE_SITE_KEY="1x00000000000000000000AA"   # siempre pasa
TURNSTILE_SECRET_KEY="1x0000000000000000000000000000000AA"  # siempre valida
```

---

## Resumen de variables de entorno

| Variable | Dónde | Servicio |
|----------|-------|----------|
| `KV_REST_API_URL` *(o `UPSTASH_REDIS_REST_URL`)* | Servidor | Upstash |
| `KV_REST_API_TOKEN` *(o `UPSTASH_REDIS_REST_TOKEN`)* | Servidor | Upstash |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cliente | Turnstile |
| `TURNSTILE_SECRET_KEY` | Servidor | Turnstile |

> La integración de Upstash en Vercel crea las variables con prefijo `KV_*`.
> `lib/security/rate-limit.ts` lee tanto `KV_REST_API_URL/TOKEN` como `UPSTASH_REDIS_REST_URL/TOKEN`.

> Nota: el CSP (SEC-04) ya incluye `challenges.cloudflare.com` para permitir el widget cuando actives Turnstile.
