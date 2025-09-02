import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Compilador optimizado
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // URLs consistentes sin trailing slashes
  trailingSlash: false,

  // Optimización de imágenes para SEO y rendimiento
  images: {
    // Formatos modernos para mejor compresión
    formats: ["image/webp", "image/avif"],

    // Tamaños responsivos optimizados
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Permitir imágenes de Sanity CDN
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/images/**",
      },
    ],

    // Optimización adicional
    minimumCacheTTL: 31536000, // 1 año
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Headers para SEO y seguridad
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Seguridad
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },

          // Performance y SEO
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },

      // Cache para assets estáticos
      {
        source: "/favicon.ico",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      // Cache para imágenes
      {
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      // Cache para assets de Next.js
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      // Headers específicos para sitemap y robots
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=86400", // 24 horas
          },
          {
            key: "Content-Type",
            value: "application/xml",
          },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=86400", // 24 horas
          },
          {
            key: "Content-Type",
            value: "text/plain",
          },
        ],
      },
    ]
  },

  // Configuración para mejor build
  poweredByHeader: false, // Remueve "X-Powered-By: Next.js"
  generateEtags: true, // ETags para caching
  compress: true, // Compresión gzip

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Optimizaciones para cliente
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }

    return config
  },
}

export default nextConfig
