"use client"

import { cn } from "@/lib/utils"
import { Product } from "@/types/product"
import { Heart, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"

export function ProductCard({
  id,
  sizes,
  title,
  urlImage,
  className,
}: Product & { className?: string }) {
  const [currentPrice, setCurrentPrice] = useState(sizes[0].price)

  return (
    <article
      className={cn(
        "group/card bg-slate-50 flex flex-col space-y-2 min-w-[260px] w-[260px] h-[460px] shadow-sm p-5 rounded-4xl",
        className
      )}
    >
      <picture className="relative">
        <Link href={`/peluches/${id}`}>
          <img
            src={urlImage}
            alt={`imagen de ${title}`}
            className="rounded-3xl w-full h-full aspect-square object-cover"
          />
        </Link>
        <button className="group transition-colors duration-300 ease-in-out bg-background absolute top-2 right-2 p-2 rounded-full cursor-pointer invisible group-hover/card:visible">
          <Heart className="size-5 group-hover:stroke-red-600" />
        </button>
      </picture>
      <div className="flex flex-col w-full h-full">
        <span className="text-xl font-bold">S/.{currentPrice}</span>
        <h3 className="text-lg font-semibold line-clamp-2 pr-5 text-wrap">{title}</h3>
      </div>
      <ScrollArea className="whitespace-nowrap">
        <div className="flex space-x-2 pb-3">
          {sizes.map(({ id, label, price }) => (
            <Badge
              key={id}
              variant="secondary"
              onClick={() => setCurrentPrice(price)}
              className={cn(
                "cursor-pointer",
                currentPrice === price && "text-primary"
              )}
            >
              {label}
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
