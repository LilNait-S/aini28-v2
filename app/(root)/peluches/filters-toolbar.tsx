"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { sizes_filters } from "@/constants/sizes"
import { cn } from "@/lib/utils"
import { Package, Tags } from "lucide-react"
import { parseAsString, useQueryState } from "nuqs"

export function FiltersToolbar() {
  const [size, setSize] = useQueryState(
    "size",
    parseAsString.withOptions({ history: "replace" }).withDefault("1")
  )

  return (
    <header className="flex space-x-6 items-center">
      <div className="flex items-center space-x-3">
        <Tags />
        <span>Ordenar</span>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Filtros</SelectLabel>
              <SelectItem value="1">Relevancia</SelectItem>
              <SelectItem value="2">A - Z</SelectItem>
              <SelectItem value="3">Z - A</SelectItem>
              <SelectItem value="4">Precio mas bajo</SelectItem>
              <SelectItem value="5">Precio mas alto</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-3">
        <Package />
        <span>Tamaños</span>
        <RadioGroup
          className="gap-2 flex"
          value={size ?? undefined}
          onValueChange={(value: string) => setSize(value)}
        >
          {sizes_filters.map(({ id, label }) => (
            <label
              key={id}
              className={cn(
                "relative flex w-full cursor-pointer flex-col items-center gap-3 rounded-full border border-input px-6 py-2 text-center outline-offset-2 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary has-[[data-state=checked]]:text-primary-foreground has-[:focus-visible]:outline has-[:focus-visible]:outline-ring/70"
              )}
            >
              <RadioGroupItem
                id={id.toString()}
                value={id.toString()}
                className="sr-only after:absolute after:inset-0"
              />
              <p className="text-xs font-medium leading-none">{label}</p>
            </label>
          ))}
        </RadioGroup>
      </div>
    </header>
  )
}
