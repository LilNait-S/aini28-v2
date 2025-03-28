import { getAllPeluches } from "@/lib/actions/product"
import Link from "next/link"
import { Fragment } from "react"
import { ProductCard } from "../product-card"
import { buttonVariants } from "../ui/button"

export async function RecentlyAdded() {
  const peluches = await getAllPeluches({ limit: 6 })

  return (
    <section>
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Recien agregados</h2>
        <Link href="#" className={buttonVariants({ variant: "link" })}>
          Ver más
        </Link>
      </header>
      <main className="grid grid-cols-4 gap-4 md:gap-6">
        {peluches.map((peluche, i) => {
          return (
            <Fragment key={peluche._id}>
              {i === 2 && (
                <img
                  src="/picture-recently-added.webp"
                  alt="imagen de peluche de gato"
                  className="h-full w-full object-cover col-span-2 rounded-4xl"
                />
              )}
              <ProductCard {...peluche} className="w-full h-full" />
            </Fragment>
          )
        })}
      </main>
    </section>
  )
}
