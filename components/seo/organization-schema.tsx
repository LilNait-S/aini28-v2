import { safeJsonLd } from "@/lib/seo/json-ld";
import { COMPANY } from "@/constants/phone-company";
import { readCompany } from "@/lib/catalog/plush";

/** Organization data from Plush; contact fields are left out when unset. */
export async function OrganizationSchema() {
  const company = await readCompany();
  const whatsapp = company?.whatsapp.replace(/\D/g, "") ?? "";
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company?.name || COMPANY.name,
    url: COMPANY.web,
    logo: `${COMPANY.web}/logo-aini28.svg`,
    description: "Catálogo de peluches de calidad en Perú.",
    ...(company?.address
      ? {
          address: {
            "@type": "PostalAddress",
            addressCountry: "PE",
            addressLocality: company.province || company.department || "Lima",
            streetAddress: company.address,
          },
        }
      : {}),
    ...(whatsapp || company?.email
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            ...(whatsapp
              ? {
                  telephone: `+${whatsapp.length === 9 ? `51${whatsapp}` : whatsapp}`,
                }
              : {}),
            ...(company?.email ? { email: company.email } : {}),
            availableLanguage: "Spanish",
          },
        }
      : {}),
    sameAs: [company?.tiktokUrl, company?.instagramUrl].filter(Boolean),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
}
