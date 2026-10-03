"use client";
import { TypographyP } from "@/components/typography-p";
import { TypographyMuted } from "@/components/typography-muted";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { sizeOptions } from "@/constants/sizes";
import { QuotedWhatsApp } from "@/components/quoted-whatsapp";
import { useCartState } from "@/lib/states/shopping-car";
import { type Product, variantLabel, effectivePrice } from "@/types/catalog";
import { ChevronDown, ChevronUp, ShoppingCart, Repeat } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
      <div className="flex items-start space-x-2">
        <span className="text-5xl font-bold">
          S/.{price.toFixed(2)}
        </span>
        {price < Number(variant.normalPrice) && (
          <div className="flex space-x-1 items-center">
          <span className="line-through text-muted-foreground">
            S/.{Number(variant.normalPrice).toFixed(2)}
          </span>
          <p className="text-muted-foreground">Antes</p>
          </div>
        )}
      </div>
      <TypographyP text={peluche.description} />
      <div className="flex flex-col space-y-2">
      <TypographyMuted text={`Tamaño aproximado: ${Object.entries(variant.attributes).filter(([key]) => key !== "Tamaño").map(([, value]) => value).join(" · ") || variantLabel(variant)}`} />
      <RadioGroup
        aria-label="Variante del producto"
        className="gap-2 flex flex-wrap sm:flex-nowrap"
        value={variant.id}
        onValueChange={(value) => setVariantId(value)}
      >
        {peluche.variants.map((v) => (
          <label
            key={v.id}
            className={cn("relative flex flex-1 cursor-pointer flex-col items-center gap-3 rounded-full border border-input px-2 py-3 text-center outline-offset-2 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-ring/70", v.id === variant.id && "border-primary bg-primary text-primary-foreground")}
          >
            <RadioGroupItem
              value={v.id}
              className="sr-only after:absolute after:inset-0"
            />
            <p className="text-xs font-medium leading-none">{v.attributes["Tamaño"] || variantLabel(v)}</p>
          </label>
        ))}
      </RadioGroup>
      </div>
      <div className="flex gap-2">
        <div className="inline-flex -space-x-px rounded-full rtl:space-x-reverse">
          <Button
            className="rounded-none shadow-none first:rounded-s-full last:rounded-e-full focus-visible:z-10"
            variant="secondary"
            aria-label="Decrease quantity"
            disabled={qty <= 1}
            onClick={decQty}
          >
            <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
          <span className="flex items-center bg-secondary w-7 justify-center px-1 text-sm">{qty}</span>
          <Button
            className="rounded-none shadow-none first:rounded-s-full last:rounded-e-full focus-visible:z-10"
            variant="secondary"
            aria-label="Increase quantity"
            disabled={qty >= 50}
            onClick={incQty}
          >
            <ChevronUp size={16} strokeWidth={2} aria-hidden="true" />
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
      <div className="flex space-x-4">
      <div className="w-full">
      <QuotedWhatsApp compact
        items={[
          { _id: peluche.id, selectedSize: variant.id, qty, finalPrice: price },
        ]}
      />
      </div>
      <Separator orientation="vertical" className="h-5" />
      <button className="flex items-start justify-center gap-1 cursor-pointer w-full" type="button" onClick={async () => {
        const url = `${window.location.origin}/peluches/${slug}?variant=${variant.id}`;
        try {
          if (navigator.share) await navigator.share({ title: peluche.name, url });
          else { await navigator.clipboard.writeText(url); toast.success("Enlace copiado."); }
        } catch { /* Dismissing the share dialog needs no error message. */ }
      }}>
        <Repeat className="size-3.5 stroke-muted-foreground" />
        <span className="text-sm text-muted-foreground">Compartir</span>
      </button>
      </div>
    </>
  );
}
