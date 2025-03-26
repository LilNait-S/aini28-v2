import { defineType, defineField } from "sanity"

export const category = defineType({
  name: "category",
  title: "Categorías",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Nombre de la Categoría",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
})
