"use server"

import { client } from "@/sanity/lib/client"
import { Product } from "@/sanity/types"
import {
  getProductBySlug,
  getProductsQuery,
  getTotalProductsQuery,
} from "../queries/product"
import { SortOption } from "@/types/models"
import { revalidatePath } from "next/cache"
import { writeClient } from "@/sanity/lib/write-client"

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
  hasSalePrice?: boolean
}>

/**
 * Fetches all products (peluches) with optional filters, pagination, and sorting.
 * @param {ProductsFilters} filters - Filters to apply to the query.
 * @returns {Promise<{ products: Product[]; totalPages: number }>} - A promise resolving to the products and total pages.
 * @throws {Error} - Throws an error if the fetch operation fails.
 */
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
      hasSalePrice: false,
    }

    // Merge provided filters with default filters
    const finalFilters = { ...defaultFilters, ...filters }
    const page = finalFilters.page ?? 1
    const pageSize = finalFilters.pageSize ?? 8
    const start = (page - 1) * pageSize
    const end = start + pageSize

    // Fetch paginated products
    const products: Product[] = await client.fetch(
      getProductsQuery({
        sort: finalFilters.sort,
        start,
        end,
        hasSalePrice: finalFilters.hasSalePrice,
      }),
      finalFilters
    )

    // Fetch total number of products
    const totalProducts: number = await client.fetch(
      getTotalProductsQuery(),
      finalFilters
    )

    // Calculate total pages
    const totalPages = Math.ceil(totalProducts / pageSize)

    return { products, totalPages }
  } catch (error) {
    console.error("Error fetching products:", error)
    throw new Error("Failed to fetch products. Please try again later.")
  }
}

/**
 * Fetches a single product (peluche) by its slug.
 * @param {Object} params - Parameters for the query.
 * @param {string} params.slug - The slug of the product to fetch.
 * @returns {Promise<Product>} - A promise resolving to the product.
 * @throws {Error} - Throws an error if the fetch operation fails or the product is not found.
 */
export async function getPeluche({ slug }: { slug: string }): Promise<Product> {
  try {
    const product: Product = await client.fetch(getProductBySlug(), { slug })

    if (!product) {
      throw new Error(`Product with slug "${slug}" not found.`)
    }

    return product
  } catch (error) {
    console.error("Error fetching product:", error)
    throw new Error("Failed to fetch product. Please try again later.")
  }
}

/**
 * Increments the like counter of a specific product.
 * @param {string} slug - The slug of the product.
 * @returns {Promise<void>} - A promise indicating whether the operation was successful.
 * @throws {Error} - Throws an error if the fetch or update operation fails.
 */
export async function incrementProductLikes(slug: string): Promise<void> {
  try {
    // Fetch the product by its slug
    const product = await writeClient.fetch(
      `*[_type == "product" && slug.current == $slug][0] {
        _id,
        likes
      }`,
      { slug }
    )

    if (!product) {
      throw new Error(`Product with slug "${slug}" not found.`)
    }

    await writeClient
      .patch(product._id)
      .set({ likes: product.likes + 1 }) // Set the current likes
      // .setIfMissing({ likes: 0 }) // Ensure the "likes" field exists
      // .inc({ likes: 1 }) // Increment the like counter
      .commit()

    revalidatePath(`/peluches/${slug}`)
  } catch (error) {
    console.error("Error incrementing product likes:", error)
    throw new Error("Failed to increment product likes.")
  }
}
