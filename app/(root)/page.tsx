import { Container } from "@/components/container"
import { FeaturedProducts } from "@/components/home/featured-products"
import { Hero } from "@/components/home/hero"
import { LowPrice } from "@/components/home/low-price"
import { RecentlyAdded } from "@/components/home/recently-added"
import { SizesSection } from "@/components/home/sizes"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Aini28 - Tienda de Peluches de Calidad en Perú | Envío Gratis Lima",
  description: "Descubre peluches adorables y de alta calidad en Aini28. Material antialérgico, todos los tamaños, envío gratis en Lima. ¡Encuentra el regalo perfecto para tus seres queridos!",
  keywords: "peluches Peru, juguetes Lima, peluches calidad, regalos niños, peluches antialergicos, tienda online Peru, juguetes seguros, peluches gigantes, peluches pequeños",
  
  openGraph: {
    title: "Aini28 - Tienda de Peluches de Calidad en Perú",
    description: "Peluches adorables y de alta calidad con envío gratis en Lima. Material antialérgico y todos los tamaños disponibles.",
    type: "website",
    url: "https://aini28.com",
    siteName: "Aini28",
    locale: "es_PE",
    images: [
      {
        url: "https://aini28.com/og-home.jpg", // Puedes crear una imagen específica
        width: 1200,
        height: 630,
        alt: "Aini28 - Tienda de peluches de calidad",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Aini28 - Tienda de Peluches de Calidad",
    description: "Peluches adorables con envío gratis en Lima. Material antialérgico y calidad garantizada.",
    creator: "@aini28_peru",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://aini28.com",
  },

  verification: {
    google: "tu-codigo-de-verificacion-google", // Agrega tu código cuando lo tengas
  },
}

export default async function Home() {
  return (
    <Container>
      <div className="space-y-20 mb-20 px-3">
        <Hero />
        <FeaturedProducts />
        <SizesSection />
        <LowPrice />
        <RecentlyAdded />
      </div>
    </Container>
  )
}
