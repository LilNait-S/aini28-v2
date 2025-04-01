import type { StructureResolver } from "sanity/structure"

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Base")
    .items([
      S.documentTypeListItem("product").title("Peluches"),
      S.documentTypeListItem("category").title("Categorias"),
      S.documentTypeListItem("banners").title("Banners"),
    ])
