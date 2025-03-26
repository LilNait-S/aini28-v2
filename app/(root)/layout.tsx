import { Footer } from "@/components/shared/footer"
import { Navbar } from "@/components/shared/navbar"
import type { Metadata } from "next"

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
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
