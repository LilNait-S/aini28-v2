import { defineField } from "sanity"

export const size = defineField({
  type: "number",
  name: "size",
  title: "Tamaño",
  description: "Selecciona un tamaño",
  options: {
    list: [
      { title: "Pequeño", value: 1 },
      { title: "Mediano", value: 2 },
      { title: "Grande", value: 3 },
      { title: "Gigante", value: 4 },
    ],
  },
})
