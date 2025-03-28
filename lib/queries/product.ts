import { SortOption } from "@/types/models"
import { defineQuery } from "next-sanity"

/**
 * Genera dinámicamente la consulta de productos con paginación y ordenamiento.
 * @param {Object} params - Parámetros opcionales de la consulta.
 * @param {SortOption | null} [params.sort] - Tipo de ordenamiento (ej. "name-asc", "name-desc").
 * @param {number} [params.start=0] - Índice inicial para la paginación.
 * @param {number} [params.end=10] - Índice final para la paginación.
 * @returns {string} - Consulta GROQ generada dinámicamente.
 */
export function getProductsQuery({
  sort = null,
  start = 0,
  end = 10,
}: {
  sort?: SortOption | null
  start?: number
  end?: number
} = {}) {
  // Mapeo de opciones de ordenamiento
  const orderBy: Record<Exclude<SortOption, null>, string> = {
    "name-asc": "name asc",
    "name-desc": "name desc",
    "price-asc": "coalesce(sizePricing[0].price, 0) asc",
    "price-desc": "coalesce(sizePricing[0].price, 0) desc",
    relevance: "isFeatured desc",
  }

  // Si sort es null, usamos _createdAt desc como predeterminado
  const orderClause = sort && orderBy[sort] ? orderBy[sort] : "_createdAt desc"

  return defineQuery(`
    *[_type == "product" 
      && defined(slug.current) 
      && (!defined($search) || name match $search)
      && (!defined($isFeatured) || isFeatured == $isFeatured)
      && (!defined($category) || category._ref == $category)
      && (!defined($minPrice) || !defined($maxPrice) || (
          defined(sizePricing) && count(
            sizePricing[price >= $minPrice && price <= $maxPrice] +
            sizePricing[salePrice >= $minPrice && salePrice <= $maxPrice]
          ) > 0
      ))
      && defined(sizePricing) 
      && count(sizePricing[isActive == $isActive && (!defined($size) || size == $size)]) > 0
    ] 
    | order(${orderClause}) [${start}...${end}] {
      _id,
      name,
      slug,
      _createdAt,
      _updatedAt,
      description,
      isFeatured,
      category -> { 
        _id, 
        title 
      },
      images,
      sizePricing
    }
  `)
}

/**
 * Genera una consulta optimizada para contar la cantidad total de productos según los filtros.
 */
export function getTotalProductsQuery() {
  return defineQuery(`
    count(*[_type == "product"
      && (!defined($search) || name match $search)
      && (!defined($isFeatured) || isFeatured == $isFeatured)
      && (!defined($category) || category._ref == $category)
      && (!defined($minPrice) || !defined($maxPrice) || count(sizePricing[price >= $minPrice && price <= $maxPrice]) > 0)
      && count(sizePricing[isActive == $isActive && (!defined($size) || size == $size)]) > 0
    ])
  `)
}

/**
 * Genera una consulta para obtener un producto específico por su slug.
 * @returns {string} - Consulta GROQ generada dinámicamente.
 */
export function getProductBySlug() {
  return defineQuery(`
    *[_type == "product" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      _createdAt,
      _updatedAt,
      description,
      isFeatured,
      category -> { 
        _id, 
        title 
      },
      images,
      sizePricing,
      isActive
    }
  `);
}