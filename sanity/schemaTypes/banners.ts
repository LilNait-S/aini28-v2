import { defineType, defineField } from "sanity"

export const banners = defineType({
  name: "banners",
  title: "Banner de la Página Principal",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      description: "Título del banner (opcional)",
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
      description: "Descripción breve del banner (opcional)",
    }),
    defineField({
      name: "image",
      title: "Imagen",
      type: "image",
      description: "Imagen del banner",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          title: "Texto Alternativo",
          type: "string",
          description:
            "Texto alternativo para la imagen (importante para accesibilidad)",
        },
      ],
    }),
    defineField({
      name: "link",
      title: "Enlace",
      type: "url",
      description: "Enlace al que redirige el banner (opcional)",
    }),
    defineField({
      name: "isActive",
      title: "Activo",
      type: "boolean",
      description: "Determina si el banner está activo o no",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      description: "Orden de aparición del banner en la página",
    }),
  ],
})
