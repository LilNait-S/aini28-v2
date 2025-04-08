"use client"

import { cn } from "@/lib/utils"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import { Product } from "@/sanity/types"
import { parseSize } from "@/utils/parse-size"
import { urlFor } from "@/sanity/lib/image"
import { toast } from "sonner"
import { useCartState } from "@/lib/states/shopping-car"

export function ProductCard({
  name,
  images,
  slug,
  sizePricing,
  className,
  _id,
}: Product & { className?: string }) {
  const [currentPrice, setCurrentPrice] = useState<number | undefined>(
    sizePricing?.[0]?.price
  )
  const [currentSalePrice, setCurrentSalePrice] = useState<number | undefined>(
    sizePricing?.[0]?.salePrice
  )

  const [size, setSize] = useState<number | undefined>(sizePricing?.[0]?.size)

  const { onAddToCart } = useCartState()

  return (
    <article
      className={cn(
        "group/card bg-slate-50 flex flex-col space-y-2 w-full sm:w-full h-auto sm:h-full shadow-sm p-5 rounded-4xl",
        className
      )}
    >
      {/* Imagen del producto */}
      <picture className="relative">
        <Link href={`/peluches/${slug?.current}`}>
          <img
            src={
              images?.[0]
                ? urlFor(images[0]).width(400).height(400).url()
                : "/placeholder-image.webp"
            }
            alt={images?.[0]?.alt || "Imagen del producto"}
            className="rounded-3xl w-full h-auto sm:h-full aspect-square object-cover"
          />
        </Link>
      </picture>

      {/* Información del producto */}
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-col sm:flex-row items-start space-x-2">
          <span className="text-lg sm:text-xl font-bold">
            S/.
            {currentSalePrice
              ? currentSalePrice.toFixed(2)
              : currentPrice?.toFixed(2)}
          </span>
          {currentSalePrice && (
            <div className="flex space-x-1 items-center text-sm mt-0.5">
              <span className="line-through text-muted-foreground">
                S/.{currentPrice?.toFixed(2)}
              </span>
              <p className="text-muted-foreground">Antes</p>
            </div>
          )}
        </div>
        <h3 className="text-sm sm:text-lg font-semibold line-clamp-2 pr-5 text-wrap">
          {name}
        </h3>
      </div>

      {/* Tamaños disponibles */}
      <ScrollArea className="whitespace-nowrap">
        <div className="flex space-x-2 pb-3">
          {sizePricing
            ?.filter(({ isActive }) => isActive)
            .map(({ _key, price, size, salePrice }) => (
              <Badge
                key={_key}
                variant="secondary"
                onClick={() => {
                  setCurrentPrice(price)
                  setCurrentSalePrice(salePrice)
                  setSize(size)
                }}
                className={cn(
                  "cursor-pointer",
                  currentPrice === price && "text-primary"
                )}
              >
                {parseSize(size).label}
              </Badge>
            ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Botón de agregar al carrito */}
      <Button
        type="button"
        onClick={() => {
          const selectedSize = sizePricing?.find(
            (s) => s.size === Number(size)
          )?.size
          if (!selectedSize) {
            toast.error("Por favor, selecciona un tamaño válido.")
            return
          }

          if (!currentPrice) {
            toast.error("El precio del producto no es válido.")
            return
          }

          const finalPrice = currentSalePrice ?? currentPrice
          if (!finalPrice) {
            toast.error("El precio del producto no es válido.")
            return
          }

          onAddToCart({
            _id,
            images: images,
            name: name ?? "",
            qty: 1,
            selectedSize,
            price: currentPrice,
            salePrice: currentSalePrice,
            finalPrice,
          })

          toast.success("Producto agregado al carrito.")
        }}
        className="text-xs sm:text-base"
      >
        <ShoppingCart />
        Agregar al carrito
      </Button>
    </article>
  )
}
