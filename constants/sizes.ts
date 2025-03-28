export const sizes = [
  {
    id: 1,
    label: "Pequeño",
    value: "small",
    price: 10,
    approximateSize: 20,
    unit: "cm",
    isActive: false,
  },
  {
    id: 2,
    label: "Mediano",
    value: "medium",
    price: 35,
    approximateSize: 40,
    unit: "cm",
    isActive: false,
  },
  {
    id: 3,
    label: "Grande",
    value: "large",
    price: 70,
    approximateSize: 80,
    unit: "cm",
    isActive: true,
  },
  {
    id: 4,
    label: "Gigante",
    value: "extra-large",
    price: 100,
    approximateSize: 120,
    unit: "cm",
    isActive: true,
  },
]
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
