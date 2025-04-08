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
import { cn } from "@/lib/utils"
import { sortFilter, sizes_filters } from "@/constants/sizes"
import { Package, Tags } from "lucide-react"
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"

export function FiltersToolbar() {
  const [size, setSize] = useQueryState(
    "size",
    parseAsString
      .withOptions({ history: "replace", shallow: false })
      .withDefault("0")
  )

  const [filters, setSetfilters] = useQueryState(
    "sort",
    parseAsString.withOptions({ history: "replace", shallow: false })
  )

  const [, setPage] = useQueryState(
    "page",
    parseAsInteger.withOptions({ history: "replace", shallow: false })
  )

  return (
    <header className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0 items-start sm:items-center">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <div className="flex items-center space-x-2">
          <Tags />
          <span className="text-sm sm:text-base">Ordenar</span>
        </div>
        <Select value={filters ?? undefined} onValueChange={setSetfilters}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Selecciona un filtro" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Filtros</SelectLabel>
              {sortFilter.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <div className="flex items-center space-x-2">
          <Package />
          <span className="text-sm sm:text-base">Tamaños</span>
        </div>
        <RadioGroup
          className="gap-2 flex flex-wrap w-full"
          value={size ?? undefined}
          onValueChange={(value: string) => {
            setSize(value)
            setPage(1)
          }}
        >
          {sizes_filters.map(({ id, label }) => (
            <label
              key={id}
              className={cn(
                "relative flex w-full sm:w-auto cursor-pointer flex-col items-center gap-3 rounded-full border border-input px-6 py-2 text-center outline-offset-2 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary has-[[data-state=checked]]:text-primary-foreground has-[:focus-visible]:outline has-[:focus-visible]:outline-ring/70"
              )}
            >
              <RadioGroupItem
                id={id.toString()}
                value={id.toString()}
                className="sr-only after:absolute after:inset-0"
              />
              <p className="text-xs sm:text-sm font-medium leading-none">
                {label}
              </p>
            </label>
          ))}
        </RadioGroup>
      </div>
    </header>
  )
}
