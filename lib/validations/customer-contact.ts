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
})
