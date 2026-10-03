import { Container } from "@/components/container";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Hero } from "@/components/home/hero";
import { LowPrice } from "@/components/home/low-price";
import { RecentlyAdded } from "@/components/home/recently-added";
import { SizesSection } from "@/components/home/sizes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Aini28 - Catálogo de peluches en Perú" },
  description:
    "Descubre los peluches de Aini28. Consulta tamaños y precios y coordina tu compra por correo o WhatsApp.",
  alternates: { canonical: "https://aini28.com" },
  openGraph: {
    title: "Aini28 - Catálogo de peluches",
    description: "Peluches de calidad en Perú. Coordina tu compra con Aini28.",
    type: "website",
    url: "https://aini28.com",
    siteName: "Aini28",
    locale: "es_PE",
    images: [{ url: "https://aini28.com/store.webp", alt: "Tienda Aini28" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aini28 - Catálogo de peluches",
    images: ["https://aini28.com/store.webp"],
  },
};
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
  );
}
