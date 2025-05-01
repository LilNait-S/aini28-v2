import { phoneSchema } from "@/components/ui/phone-input"
import { z } from "zod"

export const customerContactSchema = z.object({
  fullName: z
    .string()
    .min(3, "El nombre completo debe tener al menos 3 caracteres")
    .regex(
      /^[a-zA-ZÀ-ÿ\s]+$/,
      "El nombre completo solo puede contener letras y espacios"
    ),
  phoneNumber: phoneSchema,
  email: z.string().email("Debe ser un correo electrónico válido"),
  paymentMethod: z.number(),
  shippingMethod: z.number(),

  country: z.string().optional(),
  department: z.string().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  address: z
    .string()
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .max(100, "La dirección no puede exceder los 100 caracteres")
    .optional(),
})
