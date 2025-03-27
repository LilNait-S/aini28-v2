"use server"

import { client } from "@/sanity/lib/client"
import { Product } from "@/sanity/types"
import { PRODUCTS_QUERY } from "../queries/product"

type ProductsFilters = Partial<{
  search: string | null
  isFeatured: boolean | null
  minPrice: number | null
  maxPrice: number | null
  limit: number | null
  category: string | null
  isActive: boolean | null
}>

export async function getAllProducts(
  filters: ProductsFilters = {}
): Promise<Product[]> {
  try {
    const defaultFilters: ProductsFilters = {
      search: null,
      isFeatured: null,
      minPrice: null,
      maxPrice: null,
      limit: 8,
      category: null,
      isActive: true,
    }

    // Combinar filtros proporcionados con los valores predeterminados
    const finalFilters = Object.assign({}, defaultFilters, filters)

    const peluches: Product[] = await client.fetch(PRODUCTS_QUERY, finalFilters)
    return peluches
  } catch (error) {
    console.error("Error fetching products:", error)
    throw new Error("Failed to fetch products. Please try again later.")
  }
}
