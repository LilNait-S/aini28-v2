import { z } from "zod";
import { isDistrict, isMotorbikeDistrict } from "@/lib/ubigeo";

/** A Peruvian mobile in any common spelling, as "+519XXXXXXXX", or null. */
export function peruvianMobile(value: string): string | null {
  const match = /^(?:\+?51)?(9\d{8})$/.exec(value.replace(/[\s\-().]/g, ""));
  return match ? `+51${match[1]}` : null;
}

const district = z
  .string()
  .refine(isDistrict, "Elige departamento, provincia y distrito");

/** Delivery types and places Plush uses; shipping cost is coordinated later. */
export const deliverySchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("PICKUP") }),
  z.object({
    type: z.literal("MOTORBIKE"),
    ubigeo: district.refine(
      isMotorbikeDistrict,
      "El motorizado solo llega a Lima Metropolitana y Callao",
    ),
    address: z
      .string()
      .trim()
      .min(5, "Escribe tu dirección (calle, número, referencia)")
      .max(240),
  }),
  z.object({ type: z.literal("AGENCY"), ubigeo: district }),
]);

/** Checkout contact data, aligned with a Plush Solicitud. */
export const customerContactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Escribe tu nombre completo")
    .max(120, "Usa como máximo 120 caracteres"),
  phoneNumber: z
    .string()
    .trim()
    .max(40)
    .refine(
      (value) => peruvianMobile(value) !== null,
      "Ingresa un celular peruano de 9 dígitos que empiece con 9",
    ),
  email: z.string().trim().email("Debe ser un correo electrónico válido"),
  paymentMethod: z.enum(["YAPE", "PLIN", "TRANSFER"], {
    message: "Elige cómo pagarás",
  }),
  delivery: deliverySchema,
});

export type CustomerContact = z.infer<typeof customerContactSchema>;
