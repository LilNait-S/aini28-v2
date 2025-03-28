export const allSizes = [
  { size: 1, label: "Pequeño" },
  { size: 2, label: "Mediano" },
  { size: 3, label: "Grande" },
  { size: 4, label: "Gigante" },
];

export type SortOption =
  | null
  | "relevance" // Por relevancia
  | "name-asc" // A - Z
  | "name-desc" // Z - A
  | "price-asc" // Precio más bajo
  | "price-desc" // Precio más alto

export const sortFilter = [
  {
    value: "relevance",
    label: "Relevancia",
  },
  {
    value: "name-asc",
    label: "A - Z",
  },
  {
    value: "name-desc",
    label: "Z - A",
  },
  {
    value: "price-asc",
    label: "Precio más bajo",
  },
  {
    value: "price-desc",
    label: "Precio más alto",
  },
]

export const sizes_filters = [
  {
    id: 0,
    label: "Todos",
  },
  {
    id: 1,
    label: "Pequeño",
  },
  {
    id: 2,
    label: "Mediano",
  },
  {
    id: 3,
    label: "Grande",
  },
  {
    id: 4,
    label: "Gigante",
  },
]

export const sizeOptions = {
  1: "Pequeño",
  2: "Mediano",
  3: "Grande",
  4: "Gigante",
}
