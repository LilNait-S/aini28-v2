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
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
})
