import { Toaster } from "@/components/ui/sonner"
import { OrganizationSchema } from "@/components/seo/organization-schema"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import localFont from "next/font/local"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

const bento = localFont({
  src: "./fonts/Bento.woff2",
  variable: "--font-bento",
  weight: "400",
})

const nexus = localFont({
  src: "./fonts/Nexusbold-regular.woff2",
  variable: "--font-nexus",
  weight: "400",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://aini28.com"),
  title: {
    default: "Aini28 - Tienda de Peluches de Calidad en Perú",
    template: "%s | Aini28",
  },
  description:
    "Descubre peluches adorables y de alta calidad en Aini28. Material antialérgico, envío gratis en Lima. ¡Encuentra el regalo perfecto!",
  keywords: [
    "peluches Peru",
    "juguetes Lima",
    "peluches calidad",
    "regalos niños",
    "tienda online Peru",
  ],
  authors: [{ name: "Aini28" }],
  creator: "Aini28",
  publisher: "Aini28",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "https://aini28.com",
    siteName: "Aini28",
    title: "Aini28 - Tienda de Peluches de Calidad",
    description:
      "Peluches adorables y de alta calidad con envío gratis en Lima",
  },

  twitter: {
    card: "summary_large_image",
    title: "Aini28 - Tienda de Peluches",
    description: "Peluches de calidad con envío gratis en Lima",
    creator: "@aini28_peru",
  },

  verification: {
    // google: 'tu-codigo-verificacion-aqui',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        {/* Preconnect para recursos externos */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch para mejores performance */}
        <link rel="dns-prefetch" href="https://api.whatsapp.com" />

        {/* Theme color para móviles */}
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="msapplication-TileColor" content="#8b5cf6" />

        {/* Manifest para PWA futuro */}
        {/* <link rel="manifest" href="/manifest.json" /> */}
      </head>
      <body
        className={`${inter.className} ${bento.variable} ${nexus.variable} antialiased`}
      >
        <OrganizationSchema />
        <NuqsAdapter>
          {children}
          <Toaster richColors toastOptions={{}} closeButton theme="light" />
        </NuqsAdapter>
      </body>
    </html>
  )
}
