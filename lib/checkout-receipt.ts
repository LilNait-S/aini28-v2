import { z } from "zod";

export const receiptSchema = z.object({
  id: z.string().uuid(),
  message: z.string().max(100000),
  whatsappUrl: z
    .string()
    .url()
    .nullable()
    .refine(
      (value) => value === null || /^https:\/\/wa\.me\/\d+\?text=/.test(value),
    ),
  emailSent: z.boolean(),
  expiresAt: z.number(),
});
export type CheckoutReceipt = z.infer<typeof receiptSchema>;
const key = "aini28-checkout-receipt";
let memory: CheckoutReceipt | null = null;
let pendingHandoff = false;
export function takePendingHandoff() {
  const pending = pendingHandoff;
  pendingHandoff = false;
  return pending;
}

export function saveReceipt(receipt: CheckoutReceipt) {
  memory = receipt;
  pendingHandoff = true;
  try {
    sessionStorage.setItem(key, JSON.stringify(receipt));
  } catch {
    /* Memory supports storage-disabled browsers. */
  }
}
export function loadReceipt(now = Date.now()): CheckoutReceipt | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (raw) memory = receiptSchema.parse(JSON.parse(raw));
  } catch {
    /* Keep the in-memory receipt if storage is unavailable. */
  }
  if (!memory || memory.expiresAt <= now) {
    memory = null;
    try {
      sessionStorage.removeItem(key);
    } catch {
      /* Optional persistence. */
    }
  }
  return memory;
}

export function orderMessage(input: {
  id: string;
  name: string;
  total: string;
  payment: string;
  delivery: string;
  lines: {
    name: string;
    variantLabel: string;
    qty: number;
    finalPrice: number;
  }[];
}) {
  return [
    `Hola, soy ${input.name}. Hice una solicitud en la web de Aini28 y quiero coordinar mi compra.`,
    `Solicitud: ${input.id}`,
    "",
    ...input.lines.map(
      (item) =>
        `• ${item.qty} × ${item.name}${item.variantLabel ? ` (${item.variantLabel})` : ""} — S/ ${(item.qty * item.finalPrice).toFixed(2)}`,
    ),
    "",
    `Total de productos: S/ ${input.total}`,
    `Pago elegido: ${input.payment}`,
    `Entrega: ${input.delivery}`,
    "Costo de envío por coordinar. Quedo pendiente de confirmar el pago y la entrega.",
  ].join("\n");
}
