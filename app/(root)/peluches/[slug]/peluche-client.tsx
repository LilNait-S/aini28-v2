"use client"

import { IconStar } from "@/components/icons"
import { TypographyMuted } from "@/components/typography-muted"
import { TypographyP } from "@/components/typography-p"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { allSizes } from "@/constants/sizes"
import { cn } from "@/lib/utils"
import { Product } from "@/sanity/types"
import {
  ChevronDown,
  ChevronUp,
  Heart,
  MessageCircle,
  Repeat,
  ShoppingCart,
} from "lucide-react"
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"
import { useState } from "react"

export function PelucheClient({ peluche }: { peluche: Product }) {
  const { sizePricing } = peluche

  console.log("sizePricing", sizePricing)
  const [size, setSize] = useQueryState(
    "size",
    parseAsString
      .withOptions({ history: "replace" })
      .withDefault(
        sizePricing?.find((s) => s.isActive)?.size?.toString() ?? "1"
      )
  )

  const [qty, setQty] = useQueryState(
    "qty",
    parseAsInteger.withOptions({ history: "replace" }).withDefault(1)
  )

  const [price, setPrice] = useState<number | undefined>(
    sizePricing?.find((s) => s.size === Number(size))?.price
  )
  const [approximateSize, setApproximateSize] = useState(
    `${sizePricing?.find((s) => s.size === Number(size))?.approximateSize} ${
      sizePricing?.find((s) => s.size === Number(size))?.unit
    }`
  )
  return (
    <>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <IconStar className="size-5 fill-yellow-500" />
          <IconStar className="size-5 fill-yellow-500" />
          <IconStar className="size-5 fill-yellow-500" />
          <IconStar className="size-5 fill-yellow-500" />
          <IconStar className="size-5 fill-slate-300" />
        </div>
        <TypographyMuted text="42 reseñas" />
      </div>
      <div className="flex items-start space-x-2">
        <span className="text-5xl font-bold">S/.{price}</span>
        <div className="flex space-x-1 items-center">
          <span className="line-through text-muted-foreground">S/.80.00</span>
          <p className="text-muted-foreground">Antes</p>
        </div>
      </div>
      <TypographyP text="Nuestros peluches son importados de calidad antialérgica y rellenos de napa siliconada para mantener esa esponjosidad única." />
      <div className="flex flex-col space-y-2">
        <TypographyMuted text={`Tamaño aproximado: ${approximateSize}`} />
        <RadioGroup
          className="gap-2 flex"
          value={size ?? undefined}
          onValueChange={(value: string) => setSize(value)}
        >
          {allSizes.map(({ size: staticSize, label }) => {
            const matchingSize = sizePricing?.find((s) => s.size === staticSize)
            const isActive = matchingSize?.isActive ?? false
            const price = matchingSize?.price ?? null
            const approximateSize = matchingSize?.approximateSize ?? null
            const unit = matchingSize?.unit ?? ""

            return (
              <label
                key={staticSize}
                className={cn(
                  "relative flex w-full cursor-pointer flex-col items-center gap-3 rounded-full border border-input px-2 py-3 text-center outline-offset-2 transition-colors",
                  isActive
                    ? "has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary has-[[data-state=checked]]:text-primary-foreground has-[:focus-visible]:outline has-[:focus-visible]:outline-ring/70"
                    : "pointer-events-none opacity-30"
                )}
                onClick={() => {
                  if (isActive) {
                    setPrice(price ?? undefined)
                    setApproximateSize(`${approximateSize} ${unit}`)
                  }
                }}
              >
                <RadioGroupItem
                  id={staticSize.toString()}
                  value={staticSize.toString()}
                  className="sr-only after:absolute after:inset-0"
                  disabled={!isActive}
                />
                <p className="text-xs font-medium leading-none">{label}</p>
              </label>
            )
          })}
        </RadioGroup>
      </div>
      <div className="flex space-x-2">
        <div className="inline-flex -space-x-px rounded-full rtl:space-x-reverse">
          <Button
            className="rounded-none shadow-none first:rounded-s-full last:rounded-e-full focus-visible:z-10"
            variant="secondary"
            aria-label="Upqty"
            disabled={qty <= 1}
            onClick={() => setQty(qty - 1)}
          >
            <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
          <span className="flex items-center bg-secondary w-7 justify-center px-1 text-sm">
            {qty}
          </span>
          <Button
            className="rounded-none shadow-none first:rounded-s-full last:rounded-e-full focus-visible:z-10"
            variant="secondary"
            aria-label="Downqty"
            disabled={qty >= 50}
            onClick={() => setQty(qty + 1)}
          >
            <ChevronUp size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
        </div>
        <Button className="shrink-1 w-full">
          <ShoppingCart />
          Agregar al Carrito
        </Button>
      </div>
      <div className="flex space-x-4">
        <button className="flex items-center justify-center gap-1 cursor-pointer w-full">
          <MessageCircle className="size-3.5 stroke-muted-foreground" />
          <span className="text-sm text-muted-foreground">Chat</span>
        </button>
        <Separator orientation="vertical" className="h-5" />
        <button className="flex items-center justify-center gap-1 cursor-pointer w-full">
          <Heart className="size-3.5 stroke-muted-foreground" />
          <span className="text-sm text-muted-foreground">Favoritos</span>
        </button>

        <Separator orientation="vertical" className="h-5" />
        <button className="flex items-center justify-center gap-1 cursor-pointer w-full">
          <Repeat className="size-3.5 stroke-muted-foreground" />
          <span className="text-sm text-muted-foreground">Compartir</span>
        </button>
      </div>
    </>
  )
}
