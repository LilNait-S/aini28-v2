import "server-only";
import { cache } from "react";
import {
  catalogSchema,
  productSchema,
  bannersSchema,
  companySchema,
} from "@/types/catalog";

export function plushApiUrl(): string {
  const url = new URL(process.env.PLUSH_API_URL || "https://api.aini28.com");
  if (
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/"
  )
    throw new Error("PLUSH_API_URL must be an origin");
  const local = ["localhost", "127.0.0.1"].includes(url.hostname);
  if (
    url.protocol !== "https:" &&
    !(
      process.env.NODE_ENV !== "production" &&
      local &&
      url.protocol === "http:"
    )
  )
    throw new Error("PLUSH_API_URL requires HTTPS");
  return url.origin;
}
async function read(path: string) {
  const response = await fetch(`${plushApiUrl()}${path}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Catalog service HTTP ${response.status}`);
  return response.json();
}
export const readCatalog = cache(async (query: string) =>
  catalogSchema.parse(await read(`/api/public/catalog/products?${query}`)),
);
export const readProduct = cache(async (slug: string) => {
  const result = await read(
    `/api/public/catalog/products/${encodeURIComponent(slug)}`,
  );
  return result === null ? null : productSchema.parse(result);
});
export const readBanners = cache(async () =>
  bannersSchema.parse(await read("/api/public/banners")),
);
/** Store contact data; null when Plush cannot be reached. */
export const readCompany = cache(async () => {
  try {
    // Contact data changes rarely: cache it for 5 minutes.
    const response = await fetch(`${plushApiUrl()}/api/public/company`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return null;
    return companySchema.parse(await response.json());
  } catch {
    return null;
  }
});

/**
 * Sends a checkout Solicitud to Plush, server to server. The key never
 * reaches the browser.
 */
export async function createSaleRequest(body: unknown) {
  const key = process.env.PLUSH_WEBSITE_API_KEY;
  if (!key) throw new Error("PLUSH_WEBSITE_API_KEY is not configured");
  const response = await fetch(`${plushApiUrl()}/api/public/sale-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  const json = (await response.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  return { status: response.status, body: json };
}

export const readAllProducts = cache(async () => {
  const first = await readCatalog("pageSize=100&page=1");
  const products = [...first.products];
  for (let page = 2; page <= first.totalPages; page++)
    products.push(...(await readCatalog(`pageSize=100&page=${page}`)).products);
  return products;
});
