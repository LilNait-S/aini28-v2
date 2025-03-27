import { getAllProducts } from "@/lib/actions/product"
import Link from "next/link"
import FeaturedProductsEmptyState from "../empty/featured-products"
import { ProductCard } from "../product-card"
import { buttonVariants } from "../ui/button"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"

export async function FeaturedProducts() {
  const peluches = await getAllProducts({ isFeatured: true, limit: 10 })

  return (
    <section className="flex flex-col space-y-2">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">
          Productos destacados
        </h2>
        <Link href="#" className={buttonVariants({ variant: "link" })}>
          Ver más
        </Link>
      </header>
      {peluches.length > 0 ? (
        <ScrollArea className="whitespace-nowrap">
          <div className="flex w-max space-x-8 pb-4 pl-4">
            {peluches.map((product) => (
              <ProductCard key={product._id} {...product} />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ) : (
        <FeaturedProductsEmptyState />
      )}
    </section>
  )
}
