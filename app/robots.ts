import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/studio/',
        '/checkout/',
        '/_next/',
        '/admin/',
        '/private/',
      ],
    },
    sitemap: 'https://aini28.com/sitemap.xml',
    host: 'https://aini28.com',
  }
}
