"use server"

import { client } from "@/sanity/lib/client"
import { Product } from "@/sanity/types"
import { getProductsQuery, getTotalProductsQuery } from "../queries/product"
import { SortOption } from "@/types/models"

type ProductsFilters = Partial<{
  search: string | null
  isFeatured: boolean | null
  minPrice: number | null
  maxPrice: number | null
  category: string | null
  isActive: boolean | null
  size: number | null
  sort?: SortOption
  page?: number
  pageSize?: number
}>

export async function getAllPeluches(
  filters: ProductsFilters = {}
): Promise<{ products: Product[]; totalPages: number }> {
  try {
    const defaultFilters: Required<ProductsFilters> = {
      search: null,
      isFeatured: null,
      minPrice: null,
      maxPrice: null,
      category: null,
      isActive: true,
      size: null,
      sort: null,
      page: 1,
      pageSize: 8,
    }

    // Combinar filtros proporcionados con los valores predeterminados
    const finalFilters = { ...defaultFilters, ...filters }
    const page = finalFilters.page ?? 1
    const pageSize = finalFilters.pageSize ?? 8
    const start = (page - 1) * pageSize
    const end = start + pageSize

    // 1️⃣ Obtener productos paginados
    const products: Product[] = await client.fetch(
      getProductsQuery({ sort: finalFilters.sort, start, end }),
      finalFilters
    )

    // 2️⃣ Obtener total de productos
    const totalProducts: number = await client.fetch(
      getTotalProductsQuery(),
      finalFilters
    )

    // 3️⃣ Calcular total de páginas
    const totalPages = Math.ceil(totalProducts / pageSize)

    return { products, totalPages }
  } catch (error) {
    console.error("Error fetching products:", error)
    throw new Error("Failed to fetch products. Please try again later.")
  }
}
