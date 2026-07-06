"use client"

import { safeJsonLd } from "@/lib/seo/json-ld"

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Aini28",
    "url": "https://aini28.com",
    "logo": "https://aini28.com/logo-aini28.svg",
    "description": "Tienda online de peluches de alta calidad en Perú. Material antialérgico, envío gratis en Lima.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "PE",
      "addressLocality": "Lima",
      "addressRegion": "Lima"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "Spanish"
    },
    "sameAs": [
      "https://www.facebook.com/aini28",
      "https://www.instagram.com/aini28_peru",
      "https://www.tiktok.com/@aini28_peru"
    ],
    "founder": {
      "@type": "Person",
      "name": "Sandra Arenas"
    },
    "foundingDate": "2020",
    "numberOfEmployees": "3-10",
    "slogan": "Peluches de calidad que abrazan corazones"
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  )
}
