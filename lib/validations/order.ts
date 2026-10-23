import { z } from "zod";
import { customerContactSchema } from "./customer-contact";

/**
 * Esquema de un ítem del carrito tal como lo consume el endpoint de
 * solicitudes. Plush vuelve a cotizar todo en su servidor; `finalPrice` es el
 * precio que el cliente vio y solo sirve para detectar cambios.
 */
export const cartItemSchema = z
  .object({
    _id: z.string().uuid(),
    name: z.string().min(1).max(300),
    qty: z.number().int().positive().max(1000),
    price: z.number().nonnegative().optional(),
    salePrice: z.number().nonnegative().optional(),
    finalPrice: z.number().nonnegative(),
    selectedSize: z.string().uuid(),
    variantLabel: z.string().min(1).max(1000),
    slug: z.string().optional(),
  })
  .passthrough();

export const orderPayloadSchema = z.object({
  /** Same id on retries, so Plush records the Solicitud only once. */
  clientRequestId: z.string().uuid(),
  userDetails: customerContactSchema,
  cartItems: z.array(cartItemSchema).min(1).max(200),
});

export type OrderPayloadInput = z.infer<typeof orderPayloadSchema>;
