import type { Metadata } from "next";
import type { PeluchePayload } from "../validations/search/products";

export function catalogMetadata(
  path: "/peluches" | "/ofertas",
  query: PeluchePayload,
): Metadata {
  const filtered = Boolean(
    query.search ||
      (query.size && query.size !== "0") ||
      query.sort ||
      query.isFeatured != null ||
      query.minPrice != null ||
      query.maxPrice != null ||
      query.limit !== 8,
  );
  const canonical = `https://aini28.com${path}${!filtered && query.page > 1 ? `?page=${query.page}` : ""}`;
  const title =
    path === "/ofertas" ? "Ofertas de peluches" : "Catálogo de peluches";
  const description =
    path === "/ofertas"
      ? "Consulta las ofertas vigentes de Aini28 y coordina tu compra por correo o WhatsApp."
      : "Explora los peluches de Aini28 por tamaño y consulta tu selección por correo o WhatsApp.";
  return {
    title: query.search ? `${title}: ${query.search}` : title,
    description,
    alternates: { canonical },
    robots: { index: !filtered, follow: true },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      siteName: "Aini28",
      locale: "es_PE",
      images: [{ url: "https://aini28.com/store.webp", alt: "Tienda Aini28" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://aini28.com/store.webp"],
    },
  };
}
