"use client";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { type Product, variantLabel, effectivePrice } from "@/types/catalog";
import { useCartState } from "@/lib/states/shopping-car";
import { toast } from "sonner";
import { sizeOptions } from "@/constants/sizes";

export function ProductCard(
  product: Product & { className?: string; preferredSize?: string },
) {
  const preferredSize =
    sizeOptions[Number(product.preferredSize) as keyof typeof sizeOptions] ||
    product.preferredSize;
  const [selectedId, setSelectedId] = useState(
    product.variants.find((v) => v.attributes["Tamaño"] === preferredSize)?.id ||
      product.variants[0].id,
  );
  const selected =
    product.variants.find((v) => v.id === selectedId) ?? product.variants[0];
  const price = effectivePrice(selected);
  const onAddToCart = useCartState((s) => s.onAddToCart);
  return (
    <article
      className={cn(
        "group/card bg-slate-50 flex flex-col space-y-2 w-full h-full shadow-sm p-5 rounded-4xl",
        product.className,
      )}
    >
      <Link href={`/peluches/${product.slug}?variant=${selected.id}`}>
        <img
          src={product.imageUrl}
          alt={product.name}
          width={400}
          height={400}
          className="rounded-3xl w-full aspect-square object-cover"
        />
      </Link>
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-lg sm:text-xl font-bold">
            S/.{price.toFixed(2)}
          </span>
          {price < Number(selected.normalPrice) && (
            <span className="line-through text-muted-foreground text-sm">
              S/.{Number(selected.normalPrice).toFixed(2)}
            </span>
          )}
        </div>
        <h3 className="text-sm sm:text-lg font-semibold line-clamp-2">
          <Link href={`/peluches/${product.slug}?variant=${selected.id}`}>{product.name}</Link>
        </h3>
      </div>
      <ScrollArea className="whitespace-nowrap">
        <div className="flex gap-2 pb-3">
          {product.variants.map((v) => (
            <button
              key={v.id}
              type="button"
              aria-pressed={v.id === selected.id}
              onClick={() => setSelectedId(v.id)}
              className={cn(
                "rounded-full bg-secondary px-3 py-1 text-xs cursor-pointer",
                v.id === selected.id && "text-primary ring-1 ring-primary",
              )}
            >
              {variantLabel(v)}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <Button
        type="button"
        onClick={() => {
          onAddToCart({
            _id: product.id,
            selectedSize: selected.id,
            variantLabel: variantLabel(selected),
            name: product.name,
            imageUrl: product.imageUrl,
            qty: 1,
            price: Number(selected.normalPrice),
            salePrice: price < Number(selected.normalPrice) ? price : undefined,
            finalPrice: price,
            slug: product.slug,
          });
          toast.success("Producto agregado al carrito.");
        }}
        className="text-xs sm:text-base flex gap-2"
      >
        <ShoppingCart />
        <span>Agregar</span>
      </Button>
    </article>
  );
}
