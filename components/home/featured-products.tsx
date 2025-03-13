import Link from "next/link"
import { buttonVariants } from "../ui/button"
import { PRODUCT } from "@/constants/products"
import { ProductCard } from "../product-card"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"

export function FeaturedProducts() {
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
      <ScrollArea className="whitespace-nowrap">
        <div className="flex w-max space-x-8 pb-4 pl-4">
          {PRODUCT.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  )
}
