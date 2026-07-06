"use client"

import { Product } from "@/sanity/types"
import { urlFor } from "@/sanity/lib/image"
import { safeJsonLd } from "@/lib/seo/json-ld"

interface ProductSchemaProps {
  peluche: Product
  slug: string
}

export function ProductSchema({ peluche, slug }: ProductSchemaProps) {
  // Obtener precio y precio de oferta
  const activePricing = peluche.sizePricing?.find(s => s.isActive)
  const price = activePricing?.price || 0
  const salePrice = activePricing?.salePrice
  const finalPrice = salePrice || price

  // Obtener imágenes
  const images = peluche.images?.map(img => urlFor(img).url()) || []

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": peluche.name,
    "description": peluche.description,
    "brand": {
      "@type": "Brand",
      "name": "Aini28"
    },
    "category": "Juguetes y Peluches",
    "url": `https://aini28.com/peluches/${slug}`,
    "image": images,
    "sku": peluche.code || `aini28-${slug}`,
    "offers": {
      "@type": "Offer",
      "price": finalPrice.toFixed(2),
      "priceCurrency": "PEN",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 año
      "seller": {
        "@type": "Organization",
        "name": "Aini28",
        "url": "https://aini28.com"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": peluche.likes || 1,
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Cliente Aini28"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Excelente calidad y muy suave. Perfecto para regalar."
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  )
}
