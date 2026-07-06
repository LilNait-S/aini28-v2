import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const isProd = process.env.NODE_ENV === 'production'

/**
 * Content-Security-Policy del sitio.
 *
 * Nota: se usa 'unsafe-inline' en script/style porque Next.js inyecta scripts de
 * hidratación inline y hay JSON-LD inline (ver SEC-05), y styled-components/Tailwind
 * inyectan estilos inline. Migrar a nonces requiere generar un nonce por petición
 * y propagarlo a los scripts inline; se deja como mejora futura.
 */
function buildCsp(): string {
  const backend = process.env.NEXT_PUBLIC_BACKEND_BASE_PATH ?? ''
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com${isProd ? '' : " 'unsafe-eval'"}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://cdn.sanity.io",
    "font-src 'self' data:",
    `connect-src 'self' https://*.sanity.io https://challenges.cloudflare.com wss: ws: ${backend}`.trim(),
    "frame-src https://challenges.cloudflare.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ]
  return directives.join('; ')
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Headers de seguridad adicionales
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Content-Security-Policy en modo Report-Only: registra violaciones sin
  // bloquear. Tras validar en producción que no hay violaciones legítimas,
  // cambiar la cabecera a 'Content-Security-Policy' para aplicarla.
  response.headers.set('Content-Security-Policy-Report-Only', buildCsp())

  // HSTS: forzar HTTPS durante 1 año (solo en producción).
  if (isProd) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    )
  }

  // Headers específicos para SEO
  const url = request.nextUrl
  
  // Forzar trailing slash consistency
  if (url.pathname.endsWith('/') && url.pathname !== '/') {
    const newUrl = new URL(url)
    newUrl.pathname = url.pathname.slice(0, -1)
    return NextResponse.redirect(newUrl, 301)
  }

  // Redirects para mejor SEO si es necesario
  if (url.pathname === '/products') {
    return NextResponse.redirect(new URL('/peluches', request.url), 301)
  }

  // Headers específicos por tipo de contenido
  if (url.pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, max-age=0')
  }

  if (url.pathname.includes('/opengraph-image') || url.pathname.includes('/twitter-image')) {
    response.headers.set('Cache-Control', 'public, max-age=86400, s-maxage=86400')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
