import { safeJsonLd } from "@/lib/seo/json-ld";
import { COMPANY } from "@/constants/phone-company";
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY.name,
    url: COMPANY.web,
    logo: `${COMPANY.web}/logo-aini28.svg`,
    description: "Catálogo de peluches de calidad en Perú.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "PE",
      addressLocality: "Lima",
      streetAddress:
        "Av. Arenales 1737, Centro Comercial Arenales, Tienda 3-05A",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: `+${COMPANY.phoneNumber}`,
      email: COMPANY.email,
      availableLanguage: "Spanish",
    },
    sameAs: ["https://www.tiktok.com/@aini28.store"],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
}
