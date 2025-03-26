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
      type: "text",
      name: "description",
      title: "Descripción",
      description:
        "Describe el peluche de forma atractiva. Incluye detalles como el material, la suavidad, el tamaño y cualquier característica especial. Por ejemplo: 'Este adorable oso de peluche de 30 cm está hecho con felpa ultra suave y relleno hipoalergénico, perfecto para abrazos interminables.' Una buena descripción ayuda a los clientes a imaginar el producto y aumenta las posibilidades de compra.",
      validation: (Rule) =>
        Rule.required()
          .min(10)
          .error("La descripción debe tener al menos 10 caracteres."),
    }),
    defineField({
      name: "images",
      title: "Imágenes del Producto",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "alt",
              title: "Texto Alternativo",
              type: "string",
              description: "Descripción de la imagen para accesibilidad y SEO.",
              validation: (Rule) =>
                Rule.required().error(
                  "Debe proporcionar un texto alternativo."
                ),
            }),
          ],
        }),
      ],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .max(10)
          .error("Debe subir al menos 1 imagen y un máximo de 10."),
    }),
    defineField({
      name: "sizePricing",
      title: "Precios por Tamaño",
      type: "array",
      options: { disableActions: ["duplicate", "copy"] },
      of: [
        defineArrayMember({
          type: "object",
          title: "Precio por Tamaño",
          fields: [
            defineField(size), // Usa el campo `size` definido
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
              options: { list: ["cm", "m"], layout: "dropdown" },
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
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .max(4)
          .error("Debe haber entre 1 y 4 opciones de tamaño.")
          .custom((sizes) => {
            if (!Array.isArray(sizes)) return "Debe ser una lista válida."

            const selectedSizes = sizes.map(
              (item) => (item as { size: number }).size
            )
            const uniqueSizes = new Set(selectedSizes)

            if (selectedSizes.length !== uniqueSizes.size) {
              return "No se pueden repetir los tamaños. Cada producto debe tener un tamaño único."
            }

            return true
          }),
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "images.0",
    },
  },
})
