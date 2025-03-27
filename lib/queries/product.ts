import { defineQuery } from "next-sanity";

export const PRODUCTS_QUERY = defineQuery(`
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
    && defined(sizePricing) && count(sizePricing[isActive == $isActive]) > 0
  ] 
  | order(_createdAt desc) [0...$limit] {
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
`);