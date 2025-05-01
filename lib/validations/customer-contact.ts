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
  paymentMethod: z.string(),
  shippingMethod: z.string(),

  country: z.string().optional(),
  department: z.string().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  address: z.string().optional(),
})

export type CustomerContact = z.infer<typeof customerContactSchema>
