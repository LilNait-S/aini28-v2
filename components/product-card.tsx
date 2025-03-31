"use client"

import { cn } from "@/lib/utils"

import { Heart, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import { Product } from "@/sanity/types"
import { parseSize } from "@/utils/parse-size"
import { urlFor } from "@/sanity/lib/image"

export function ProductCard({
  name,
  images,
  slug,
  sizePricing,
  className,
}: Product & { className?: string }) {
  const [currentPrice, setCurrentPrice] = useState<number | undefined>(
    sizePricing?.[0]?.price
  )
  const [currentSalePrice, setCurrentSalePrice] = useState<number | undefined>(
    sizePricing?.[0]?.salePrice
  )

  return (
    <article
      className={cn(
        "group/card bg-slate-50 flex flex-col space-y-2 min-w-[260px] w-[260px] h-[460px] shadow-sm p-5 rounded-4xl",
        className
      )}
    >
      <picture className="relative">
        <Link href={`/peluches/${slug?.current}`}>
          <img
            src={
              images?.[0]
                ? urlFor(images[0]).width(400).height(400).url()
                : "/placeholder-image.webp"
            }
            alt={images?.[0]?.alt || "Imagen del producto"}
            className="rounded-3xl w-full h-full aspect-square object-cover"
          />
        </Link>
        <button className="group transition-colors duration-300 ease-in-out bg-background absolute top-2 right-2 p-2 rounded-full cursor-pointer invisible group-hover/card:visible">
          <Heart className="size-5 group-hover:stroke-red-600" />
        </button>
      </picture>
      <div className="flex flex-col w-full h-full">
        <div className="flex items-start space-x-2">
          <span className="text-xl font-bold">
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
        <h3 className="text-lg font-semibold line-clamp-2 pr-5 text-wrap">
          {name}
        </h3>
      </div>
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
      <Button>
        <ShoppingCart />
        Agregar al carrito
      </Button>
    </article>
  )
}
