import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/shared/navbar"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

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
      <body className={`${inter.className} antialiased`}>
        <div className="container max-w-7xl mx-auto">
          <Navbar />
          {children}
        </div>

        <Toaster richColors toastOptions={{}} closeButton />
      </body>
    </html>
  )
}
