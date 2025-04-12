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
    <section className="flex flex-col lg:flex-row gap-4 items-center">
      <picture className="relative overflow-hidden rounded-4xl w-full h-full lg:w-[60%] aspect-square lg:aspect-auto">
        <div className="absolute bg-gradient-to-r from-primary to-transparent h-full w-full" />
        <img
          src="/gato-low-price.webp"
          alt="imagen de peluche de gato"
          className="w-full h-full object-cover"
        />
        <figcaption className="absolute top-8 sm:top-12 left-8 sm:left-12 text-white text-4xl sm:text-6xl font-bold max-w-96 z-20">
          Por menos de S/.50
        </figcaption>
        <Link
          href={`/peluches?sort=price-asc`}
          className={cn(
            "absolute bottom-8 sm:bottom-12 left-8 sm:left-12 !pl-5 z-20",
            buttonVariants({ variant: "secondary" })
          )}
        >
          Ver más <ChevronsRight />
        </Link>
      </picture>
      {products.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full lg:w-full">
          {products.map((product, index) => (
            <ProductCard
              key={product._id}
              {...product}
              className={cn(
                index > 1 && "hidden lg:flex",
                index > 2 && "lg:hidden"
              )}
            />
          ))}
        </div>
      ) : (
        <BudgetProductsEmptyState />
      )}
    </section>
  )
}
