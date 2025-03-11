"use client"

import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "./ui/button"
import { Product } from "@/types/product"
import { Badge } from "./ui/badge"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import Link from "next/link"

function isLongTitle(title: string, length: number = 15): boolean {
  return title.length > length
}

export function ProductCard({ id, sizes, title, urlImage }: Product) {
  const [currentPrice, setCurrentPrice] = useState(sizes[0].price)

  return (
    <article className="group/card bg-slate-50 flex flex-col space-y-2 max-w-[260px] w-full shadow-sm p-5 rounded-4xl">
      <picture className="relative">
        <Link href={`/products/${id}`}>
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
      <div className="flex flex-col w-full">
        <span className="text-xl font-bold">S/.{currentPrice}</span>
        {isLongTitle(title) ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <h3 className="text-lg font-semibold line-clamp-1 pr-5">
                  {title}
                </h3>
              </TooltipTrigger>
              <TooltipContent>
                <h3>{title}</h3>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <h3 className="text-lg font-semibold line-clamp-1 pr-5">{title}</h3>
        )}
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
