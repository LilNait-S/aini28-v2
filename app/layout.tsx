import { Toaster } from "@/components/ui/sonner"
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
  title: "Aini28 - Tienda de peluches",
  description:
    "Descubre una amplia variedad de peluches adorables y de alta calidad en Aini28. Perfectos para regalos, decoración o coleccionar. ¡Explora ahora y encuentra el peluche ideal!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} ${bento.variable} ${nexus.variable} antialiased`}
      >
        <NuqsAdapter>
          {children}
          <Toaster richColors toastOptions={{}} closeButton />
        </NuqsAdapter>
      </body>
    </html>
  )
}
