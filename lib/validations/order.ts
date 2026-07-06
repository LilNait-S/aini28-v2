import { z } from "zod"
import { customerContactSchema } from "./customer-contact"

/**
 * Esquema de un ítem del carrito tal como lo consume el endpoint de correo.
 * Se validan los campos usados en el email con límites razonables; los campos
 * no usados (p. ej. `images`) se permiten sin validación estricta.
 */
export const cartItemSchema = z
  .object({
    _id: z.string().optional(),
    name: z.string().min(1).max(300),
    qty: z.number().int().positive().max(1000),
    price: z.number().nonnegative().optional(),
    salePrice: z.number().nonnegative().optional(),
    finalPrice: z.number().nonnegative(),
    selectedSize: z.number(),
    slug: z.string().optional(),
  })
  .passthrough()

export const orderPayloadSchema = z.object({
  userDetails: customerContactSchema,
  cartItems: z.array(cartItemSchema).min(1).max(200),
})

export type OrderPayloadInput = z.infer<typeof orderPayloadSchema>
