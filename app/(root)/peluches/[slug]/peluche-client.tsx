"use client";
import { TypographyP } from "@/components/typography-p";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { sizeOptions } from "@/constants/sizes";
import { QuotedWhatsApp } from "@/components/quoted-whatsapp";
import { useCartState } from "@/lib/states/shopping-car";
import { type Product, variantLabel, effectivePrice } from "@/types/catalog";
import { ChevronDown, ChevronUp, ShoppingCart } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { toast } from "sonner";

export function PelucheClient({
  peluche,
  slug,
}: {
  peluche: Product;
  slug: string;
}) {
  const [variantId, setVariantId] = useQueryState(
    "variant",
    parseAsString.withOptions({ history: "replace" }),
  );
  const [legacySize] = useQueryState("size", parseAsString);
  const variant =
    peluche.variants.find((v) => v.id === variantId) ??
    peluche.variants.find(
      (v) =>
        v.attributes["Tamaño"] ===
        sizeOptions[Number(legacySize) as keyof typeof sizeOptions],
    ) ??
    peluche.variants[0];
  const price = effectivePrice(variant);
  const { onAddToCart, qty, decQty, incQty } = useCartState();
  return (
    <>
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="text-4xl sm:text-5xl font-bold">
          S/.{price.toFixed(2)}
        </span>
        {price < Number(variant.normalPrice) && (
          <span className="line-through text-muted-foreground">
            S/.{Number(variant.normalPrice).toFixed(2)}
          </span>
        )}
      </div>
      <TypographyP text={peluche.description} />
      <RadioGroup
        aria-label="Variante del producto"
        className="flex flex-wrap gap-2"
        value={variant.id}
        onValueChange={(value) => setVariantId(value)}
      >
        {peluche.variants.map((v) => (
          <label
            key={v.id}
            className="relative cursor-pointer rounded-full border px-4 py-3 text-center has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary has-[[data-state=checked]]:text-primary-foreground"
          >
            <RadioGroupItem
              value={v.id}
              className="sr-only after:absolute after:inset-0"
            />
            {variantLabel(v)}
          </label>
        ))}
      </RadioGroup>
      <div className="flex gap-2">
        <div className="inline-flex rounded-full bg-secondary">
          <Button
            variant="secondary"
            aria-label="Decrease quantity"
            disabled={qty <= 1}
            onClick={decQty}
          >
            <ChevronDown />
          </Button>
          <span className="flex items-center px-2">{qty}</span>
          <Button
            variant="secondary"
            aria-label="Increase quantity"
            disabled={qty >= 50}
            onClick={incQty}
          >
            <ChevronUp />
          </Button>
        </div>
        <Button
          className="flex-1"
          onClick={() => {
            onAddToCart({
              _id: peluche.id,
              selectedSize: variant.id,
              variantLabel: variantLabel(variant),
              name: peluche.name,
              imageUrl: peluche.imageUrl,
              qty,
              price: Number(variant.normalPrice),
              salePrice:
                price < Number(variant.normalPrice) ? price : undefined,
              finalPrice: price,
              slug,
            });
            toast.success("Producto agregado al carrito.");
          }}
        >
          <ShoppingCart />
          Agregar al carrito
        </Button>
      </div>
      <QuotedWhatsApp
        items={[
          { _id: peluche.id, selectedSize: variant.id, qty, finalPrice: price },
        ]}
      />
    </>
  );
}
