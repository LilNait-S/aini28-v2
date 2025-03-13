import Link from "next/link"
import { buttonVariants } from "../ui/button"
import { PRODUCT } from "@/constants/products"
import { ProductCard } from "../product-card"
import { Fragment } from "react"

export function RecentlyAdded() {
  return (
    <section>
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Recien agregados</h2>
        <Link href="#" className={buttonVariants({ variant: "link" })}>
          Ver más
        </Link>
      </header>
      <main className="grid grid-cols-4 gap-4 md:gap-6">
        {PRODUCT.slice(0, 6).map((product, i) => {
          return (
            <Fragment key={product.id}>
              {i === 2 && (
                <img
                  src="/picture-recently-added.webp"
                  alt="imagen de peluche de gato"
                  className="h-full w-full object-cover col-span-2 rounded-4xl"
                />
              )}
              <ProductCard {...product} className="w-full h-full" />
            </Fragment>
          )
        })}
      </main>
    </section>
  )
}
