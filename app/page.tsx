import { FeaturedProducts } from "@/components/home/featured-products"
import { Hero } from "@/components/home/hero"
import { SizesSection } from "@/components/home/sizes"

export default function Home() {
  return (
    <div className="space-y-20 mb-20 px-3">
      <Hero />
      <FeaturedProducts />
      <SizesSection />
    </div>
  )
}
