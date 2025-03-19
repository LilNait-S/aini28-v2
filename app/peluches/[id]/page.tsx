"use client"

import { IconStar } from "@/components/icons"
import { TypographyMuted } from "@/components/typography-muted"
import { TypographyP } from "@/components/typography-p"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { parseAsString, useQueryState } from "nuqs"
import { PelucheBreadcrumb } from "./peluche-breadcrumb"
import { sizes } from "@/constants/sizes"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function Peluche() {
  const [size, setSize] = useQueryState(
    "size",
    parseAsString
      .withOptions({ history: "replace" })
      .withDefault(sizes[0].id.toString())
  )

  const [price, setPrice] = useState<number | undefined>(
    sizes.find((s) => s.id === Number(size))?.price
  )
  const [approximateSize, setApproximateSize] = useState(
    `${sizes.find((s) => s.id === Number(size))?.approximateSize} ${
      sizes.find((s) => s.id === Number(size))?.unit
    }`
  )

  return (
    <section className="flex flex-col">
      <header className="py-4">
        <PelucheBreadcrumb pelucheName="Gorila colores" />
      </header>
      <main className="grid grid-cols-2 gap-4">
        <picture className="rounded-2xl overflow-hidden">
          <img
            src="/erizo-mediano.webp"
            alt="erizo"
            className="h-full w-full object-cover"
          />
        </picture>
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <span>Aini28</span>
            <span>P008</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Gorila colores</h1>
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
              <span className="line-through text-muted-foreground">
                S/.80.00
              </span>
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
              {sizes.map(
                ({
                  id,
                  label,
                  value,
                  approximateSize,
                  unit,
                  price,
                  isActive,
                }) => (
                  <label
                    key={id}
                    className={cn(
                      "relative flex w-full cursor-pointer flex-col items-center gap-3 rounded-lg border border-input px-2 py-3 text-center outline-offset-2 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary has-[[data-state=checked]]:text-white has-[:focus-visible]:outline has-[:focus-visible]:outline-ring/70",
                      !isActive && "pointer-events-none opacity-30"
                    )}
                    onClick={() => {
                      setPrice(price)
                      setApproximateSize(`${approximateSize} ${unit}`)
                    }}
                  >
                    <RadioGroupItem
                      id={value}
                      value={id.toString()}
                      className="sr-only after:absolute after:inset-0"
                      disabled={!isActive}
                    />
                    <p className="text-xs font-medium leading-none">{label}</p>
                  </label>
                )
              )}
            </RadioGroup>
          </div>
        </div>
      </main>
    </section>
  )
}
