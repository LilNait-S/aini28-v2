import { z } from "zod"

const sortOptions = [
  "name-asc",
  "name-desc",
  "price-asc",
  "price-desc",
  "relevance",
] as const

export const searchParamsPeluchesSchema = z.object({
  search: z.string().nullable().optional(),
  isFeatured: z.boolean().nullable().optional(),
  minPrice: z.coerce.number().nullable().optional(),
  maxPrice: z.coerce.number().nullable().optional(),
  category: z.string().nullable().optional(),
  isActive: z.boolean().nullable().optional(),
  limit: z.coerce.number().default(8).optional(),
  size: z.coerce.number().optional(),
  sort: z.enum(sortOptions).nullable().optional(),
  page: z.coerce.number().default(1).optional(),
})

export const getPeluchesSchema = searchParamsPeluchesSchema
export type PeluchePayload = z.infer<typeof getPeluchesSchema>
