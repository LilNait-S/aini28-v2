import { readAllProducts } from "@/lib/catalog/plush";
import type { MetadataRoute } from "next";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await readAllProducts();
  return [
    { url: "https://aini28.com", changeFrequency: "daily", priority: 1 },
    {
      url: "https://aini28.com/peluches",
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://aini28.com/nosotros",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://aini28.com/ofertas",
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://aini28.com/claims-book",
      changeFrequency: "monthly",
      priority: 0.4,
    },
    ...products.map((p) => ({
      url: `https://aini28.com/peluches/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
