import { z } from "zod";
const optionalBoolean = z.preprocess(
  (value) => (value === "true" ? true : value === "false" ? false : value),
  z.boolean().nullable().optional(),
);
export const searchParamsPeluchesSchema = z.object({
  search: z.string().max(120).nullable().optional(),
  isFeatured: optionalBoolean,
  minPrice: z.coerce.number().finite().min(0).nullable().optional(),
  maxPrice: z.coerce.number().finite().min(0).nullable().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(8),
  size: z.string().max(100).optional(),
  sort: z
    .enum([
      "name-asc",
      "name-desc",
      "price-asc",
      "price-desc",
      "relevance",
      "recent",
    ])
    .nullable()
    .optional(),
  page: z.coerce.number().int().min(1).max(10000).default(1),
});
export const getPeluchesSchema = searchParamsPeluchesSchema;
export type PeluchePayload = z.infer<typeof getPeluchesSchema>;
