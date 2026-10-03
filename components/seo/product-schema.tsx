import { type Product, effectivePrice } from "@/types/catalog";
import { safeJsonLd } from "@/lib/seo/json-ld";
export function ProductSchema({
  peluche,
  slug,
}: {
  peluche: Product;
  slug: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: peluche.name,
    description: peluche.description,
    image: [peluche.imageUrl],
    url: `https://aini28.com/peluches/${slug}`,
    brand: { "@type": "Brand", name: "Aini28" },
    offers: peluche.variants.map((v) => ({
      "@type": "Offer",
      sku: v.sku,
      name: Object.values(v.attributes).join(" · "),
      price: effectivePrice(v).toFixed(2),
      priceCurrency: "PEN",
      url: `https://aini28.com/peluches/${slug}?variant=${v.id}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
}
