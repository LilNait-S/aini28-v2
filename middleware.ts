import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Headers de seguridad adicionales
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

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
