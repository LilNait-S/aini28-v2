import { z } from "zod";
import type { Product } from "../../types/catalog";

export const quoteRequestSchema = z.object({
  cartItems: z
    .array(
      z.object({
        _id: z.string().uuid(),
        selectedSize: z.string().uuid(),
        qty: z.number().int().min(1).max(1000),
        finalPrice: z.number().finite().nonnegative(),
      }),
    )
    .min(1)
    .max(200),
});

export class UnpublishedItemError extends Error {}

/** Resolve identity and all editorial/money fields from the public projection. */
export function quoteCart(
  input: z.infer<typeof quoteRequestSchema>,
  products: Product[],
) {
  const seen = new Set<string>();
  const cartItems = input.cartItems.map((item) => {
    const product = products.find((p) => p.id === item._id);
    const variant = product?.variants.find((v) => v.id === item.selectedSize);
    if (!product || !variant)
      throw new UnpublishedItemError(
        "Este producto o variante ya no está publicado. Retíralo del carrito.",
      );
    if (variant.availability === "SOLD_OUT")
      throw new UnpublishedItemError(
        `${product.name} (${Object.values(variant.attributes).join(" · ") || variant.sku}) se agotó. Retíralo del carrito.`,
      );
    if (seen.has(variant.id))
      throw new UnpublishedItemError(
        "El carrito contiene una variante duplicada.",
      );
    seen.add(variant.id);
    const priceCents = Number(variant.normalPrice.replace(".", ""));
    const offerCents =
      variant.offerPrice === null
        ? null
        : Number(variant.offerPrice.replace(".", ""));
    const cents =
      offerCents !== null && offerCents > 0 && offerCents < priceCents
        ? offerCents
        : priceCents;
    return {
      _id: product.id,
      selectedSize: variant.id,
      qty: item.qty,
      name: product.name,
      slug: product.slug,
      variantLabel:
        Object.values(variant.attributes).join(" · ") || variant.sku,
      imageUrl: product.imageUrl,
      price: priceCents / 100,
      salePrice: cents < priceCents ? cents / 100 : undefined,
      finalPrice: cents / 100,
      lineTotalCents: cents * item.qty,
    };
  });
  const totalCents = cartItems.reduce(
    (sum, item) => sum + item.lineTotalCents,
    0,
  );
  if (!Number.isSafeInteger(totalCents))
    throw new UnpublishedItemError(
      "El total de esta solicitud excede el límite permitido.",
    );
  return {
    cartItems,
    total: totalCents / 100,
    changed: cartItems.some(
      (item, index) => item.finalPrice !== input.cartItems[index].finalPrice,
    ),
  };
}

const recordedItemsSchema = z.array(
  z.object({
    variantId: z.string(),
    quantity: z.number().int().positive(),
    unitPrice: z.string().regex(/^\d+(?:\.\d{1,2})?$/),
  }),
);

/**
 * Confirmation email lines from what Plush recorded (variant, quantity,
 * frozen price) and the Plush catalog names. Browser-sent names never reach
 * an email sent from the store's account.
 */
export function recordedEmailLines(items: unknown, products: Product[]) {
  return recordedItemsSchema.parse(items).map((item) => {
    const product = products.find((p) =>
      p.variants.some((v) => v.id === item.variantId),
    );
    const variant = product?.variants.find((v) => v.id === item.variantId);
    return {
      name: product?.name ?? "Peluche",
      qty: item.quantity,
      finalPrice: Number(item.unitPrice),
      variantLabel: variant
        ? Object.values(variant.attributes).join(" · ") || variant.sku
        : "",
    };
  });
}
