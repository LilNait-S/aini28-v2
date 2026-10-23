import { z } from "zod";

const money = z.string().regex(/^\d+\.\d{2}$/);
export const variantSchema = z.object({
  id: z.string().uuid(),
  sku: z.string(),
  attributes: z.record(z.string()),
  normalPrice: money,
  offerPrice: money.nullable(),
  /**
   * Plush shows stock and on-order alike as AVAILABLE. Defaults to AVAILABLE
   * while an older Plush API does not send it yet.
   */
  availability: z.enum(["AVAILABLE", "SOLD_OUT"]).default("AVAILABLE"),
  imageUrl: z.string().url(),
});
export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  featured: z.boolean(),
  description: z.string(),
  imageUrl: z.string().url(),
  updatedAt: z.string().datetime(),
  variants: z.array(variantSchema).min(1),
});
export const catalogSchema = z.object({
  products: z.array(productSchema),
  total: z.number().int(),
  totalPages: z.number().int(),
});
export const bannerSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  alt: z.string(),
  link: z.string(),
  active: z.boolean(),
  order: z.number().int(),
  imageUrl: z.string().url(),
});
export const bannersSchema = z.object({ banners: z.array(bannerSchema) });
/** Public contact data the store manages in Plush. */
export const companySchema = z.object({
  name: z.string(),
  whatsapp: z.string(),
  email: z.string(),
  address: z.string(),
  district: z.string(),
  province: z.string(),
  department: z.string(),
  reference: z.string(),
  mapsUrl: z.string(),
  tiktokUrl: z.string(),
  instagramUrl: z.string(),
});
export type Company = z.infer<typeof companySchema>;
/** wa.me link to the store WhatsApp, or null when Plush has none. */
export function whatsappLink(company: Company | null, text?: string) {
  const digits = company?.whatsapp.replace(/\D/g, "") ?? "";
  if (!digits) return null;
  const number = digits.length === 9 ? `51${digits}` : digits;
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
export type Product = z.infer<typeof productSchema>;
export type ProductVariant = z.infer<typeof variantSchema>;
export type Banner = z.infer<typeof bannerSchema>;
export function variantLabel(variant: ProductVariant): string {
  return Object.values(variant.attributes).join(" · ") || variant.sku;
}
export function effectivePrice(variant: ProductVariant): number {
  const normal = Number(variant.normalPrice);
  const offer = variant.offerPrice === null ? null : Number(variant.offerPrice);
  return offer !== null && offer > 0 && offer < normal ? offer : normal;
}
