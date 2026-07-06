import "server-only"

/**
 * Verificación de CAPTCHA con Cloudflare Turnstile.
 *
 * Comportamiento:
 * - Si `TURNSTILE_SECRET_KEY` NO está configurada, la verificación se OMITE
 *   (devuelve true). Esto evita romper el formulario actual mientras no se
 *   integra el widget en el frontend.
 * - Si SÍ está configurada, se exige un token válido: sin token o token
 *   inválido -> false.
 *
 * Para activarlo:
 * 1. Crear un sitio Turnstile en Cloudflare.
 * 2. Añadir `TURNSTILE_SECRET_KEY` (servidor) y `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
 *    (cliente) al entorno.
 * 3. Renderizar el widget en los formularios (claims-book y checkout) y enviar
 *    el token resultante como `captchaToken` en el payload.
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

export async function verifyCaptcha(
  token: string | undefined,
  remoteIp?: string
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY

  // No configurado -> no se exige CAPTCHA todavía.
  if (!secret) return true

  if (!token) return false

  try {
    const body = new URLSearchParams({ secret, response: token })
    if (remoteIp && remoteIp !== "unknown") body.append("remoteip", remoteIp)

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    })

    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch {
    // Ante un fallo de red con el verificador, denegamos por seguridad.
    return false
  }
}
