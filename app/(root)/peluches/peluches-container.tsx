import { ProductCard } from "@/components/product-card"
import { Product } from "@/sanity/types"

interface PeluchesContainerProps {
  peluches: Product[]
}

export function PeluchesContainer({ peluches }: PeluchesContainerProps) {
  return (
    <main className="grid grid-cols-4 gap-10">
      {peluches.map((product) => (
        <ProductCard key={product._id} {...product} className="w-full h-full" />
      ))}
    </main>
  )
}
