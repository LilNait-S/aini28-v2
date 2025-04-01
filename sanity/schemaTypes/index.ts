import { type SchemaTypeDefinition } from "sanity"
import { product } from "./products"
import { category } from "./categories"
import { banners } from "./banners"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, category, banners],
}
