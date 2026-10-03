"use server";
import { readCatalog, readProduct, readAllProducts } from "@/lib/catalog/plush";
import { sizeOptions } from "@/constants/sizes";
import type { SortOption } from "@/types/models";

type ProductsFilters = Partial<{
  search: string | null;
  isFeatured: boolean | null;
  minPrice: number | null;
  maxPrice: number | null;
  size: string | number | null;
  sort: SortOption;
  page: number;
  pageSize: number;
  limit: number;
  hasSalePrice: boolean;
}>;
export async function getAllPeluches(filters: ProductsFilters = {}) {
  const params = new URLSearchParams({
    page: String(filters.page ?? 1),
    pageSize: String(Math.min(filters.pageSize ?? filters.limit ?? 8, 100)),
    sort: filters.sort === "relevance" ? "recent" : (filters.sort ?? "recent"),
  });
  if (filters.search?.trim()) params.set("search", filters.search.trim());
  if (filters.isFeatured != null || filters.sort === "relevance")
    params.set("featured", String(filters.isFeatured ?? true));
  if (filters.hasSalePrice) params.set("offers", "true");
  if (filters.minPrice != null)
    params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice != null)
    params.set("maxPrice", String(filters.maxPrice));
  if (filters.size && String(filters.size) !== "0")
    params.set(
      "size",
      sizeOptions[Number(filters.size) as keyof typeof sizeOptions] ??
        String(filters.size),
    );
  return readCatalog(params.toString());
}
export async function getPeluche({ slug }: { slug: string }) {
  return readProduct(slug);
}
export async function getCatalogSizes() {
  const products = await readAllProducts();
  return [
    ...new Set(
      products.flatMap((p) =>
        p.variants.map((v) => v.attributes["Tamaño"]).filter(Boolean),
      ),
    ),
  ].sort((a, b) => {
    const order = ["Pequeño", "Mediano", "Grande", "Gigante"];
    return (
      (order.includes(a) ? order.indexOf(a) : 100) -
        (order.includes(b) ? order.indexOf(b) : 100) || a.localeCompare(b, "es")
    );
  });
}
