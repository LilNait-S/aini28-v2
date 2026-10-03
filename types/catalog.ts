import { z } from "zod";

const money = z.string().regex(/^\d+\.\d{2}$/);
export const variantSchema = z.object({
  id: z.string().uuid(),
  sku: z.string(),
  attributes: z.record(z.string()),
  normalPrice: money,
  offerPrice: money.nullable(),
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
