import { getAllPeluches } from "@/lib/actions/product"
import { cn } from "@/lib/utils"
import { ChevronsRight } from "lucide-react"
import Link from "next/link"
import BudgetProductsEmptyState from "../empty/budget-products"
import { ProductCard } from "../product-card"
import { buttonVariants } from "../ui/button"

export async function LowPrice() {
  const { products } = await getAllPeluches({
    minPrice: 0,
    maxPrice: 50,
    pageSize: 3,
  })

  return (
    <section className="flex gap-4 items-center">
      <picture className="relative w-1/2 max-w-lg h-auto overflow-hidden rounded-4xl">
        <div className="absolute bg-gradient-to-r from-primary to-transparent h-full w-full" />
        <img
          src="/gato-low-price.webp"
          alt="imagen de peluche de gato"
          className="w-full h-auto object-cover"
        />
        <figcaption className="absolute top-12 left-12 text-white text-6xl font-bold max-w-96 z-20">
          Por menos de S/.50
        </figcaption>
        <Link
          href={"/peluches"}
          className={cn(
            "absolute bottom-12 left-12 !pl-5 z-20",
            buttonVariants({ variant: "secondary" })
          )}
        >
          Ver mas <ChevronsRight />
        </Link>
      </picture>
      {products.length > 0 ? (
        <div className="flex space-x-4">
          {products.map((product) => (
            <ProductCard key={product._id} {...product} />
          ))}
        </div>
      ) : (
        <BudgetProductsEmptyState />
      )}
    </section>
  )
}
