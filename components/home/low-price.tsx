import { ChevronsRight } from "lucide-react"
import { buttonVariants } from "../ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ProductCard } from "../product-card"
import { PRODUCT } from "@/constants/products"

export function LowPrice() {
  return (
    <section className="flex gap-4">
      <picture className="relative w-fit overflow-hidden rounded-4xl">
        <div className="absolute bg-gradient-to-r from-primary to-transparent h-full w-full" />
        <img
          src="/gato-low-price.webp"
          alt="imagen de peluche de gato"
          className="h-full w-full aspect-square object-cover"
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
      <div className="flex space-x-4">
        {PRODUCT.slice(0, 3).map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  )
}
