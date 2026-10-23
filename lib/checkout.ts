import { ubigeoLabel } from "@/lib/ubigeo";
import type { CustomerContact } from "@/lib/validations/customer-contact";

export const paymentMethodLabels = {
  YAPE: "Yape",
  PLIN: "Plin",
  TRANSFER: "Transferencia bancaria",
} as const;

export const deliveryTypeLabels = {
  PICKUP: "Recojo en tienda",
  MOTORBIKE: "Motorizado (Lima y Callao)",
  AGENCY: "Agencia (Shalom u Olva)",
} as const;

/** "Motorizado (Lima y Callao) · Miraflores, Lima, Lima". */
export function deliveryLabel(delivery: CustomerContact["delivery"]) {
  const label = deliveryTypeLabels[delivery.type];
  return delivery.type === "PICKUP"
    ? label
    : `${label} · ${ubigeoLabel(delivery.ubigeo)}`;
}
