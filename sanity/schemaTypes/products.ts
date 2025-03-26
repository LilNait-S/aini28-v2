import { defineType, defineField, defineArrayMember } from "sanity"
import { Box } from "lucide-react"
import { size } from "./sizes" // Asegúrate de que `size` está bien definido

export const product = defineType({
  name: "product",
  title: "Producto",
  type: "document",
  icon: Box,
  fields: [
    defineField({
      type: "string",
      name: "code",
      title: "Código del Producto",
    }),
    defineField({
      type: "string",
      name: "name",
      title: "Nombre del Producto",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      type: "text",
      name: "description",
      title: "Descripción",
      description: "Descripción detallada del producto",
      validation: (Rule) =>
        Rule.required()
          .min(10)
          .error("La descripción debe tener al menos 10 caracteres."),
    }),
    defineField({
      type: "string",
      name: "imageUrl",
      title: "URL de la Imagen",
      validation: (Rule) => Rule.required().error("Debe ser una URL válida."),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sizePricing",
      title: "Precios por Tamaño",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          title: "Precio por Tamaño",
          fields: [
            defineField(size), // Asegúrate de que `size` está bien definido
            defineField({
              name: "price",
              title: "Precio Base",
              type: "number",
              validation: (Rule) =>
                Rule.required()
                  .min(0)
                  .error("El precio base debe ser mayor o igual a 0."),
            }),
            defineField({
              name: "salePrice",
              title: "Precio de Oferta",
              type: "number",
              validation: (Rule) =>
                Rule.min(0).error("El precio de oferta no puede ser negativo."),
            }),
            defineField({
              name: "unit",
              title: "Unidad de Medida",
              type: "string",
              options: {
                list: ["cm", "m"],
                layout: "dropdown",
              },
              validation: (Rule) =>
                Rule.required().error("Debe seleccionar una unidad de medida."),
            }),
            defineField({
              name: "approximateSize",
              title: "Tamaño Aproximado",
              type: "number",
              description: "Tamaño estimado en la unidad seleccionada",
            }),
            defineField({
              name: "isActive",
              title: "Estado Activo",
              type: "boolean",
              initialValue: true,
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "imageUrl",
    },
  },
})


