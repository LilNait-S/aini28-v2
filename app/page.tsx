import { FeaturedProducts } from "@/components/home/featured-products"
import { Hero } from "@/components/home/hero"
import { LowPrice } from "@/components/home/low-price"
import { RecentlyAdded } from "@/components/home/recently-added"
import { SizesSection } from "@/components/home/sizes"

export default function Home() {
  return (
    <div className="space-y-20 mb-20 px-3">
      <Hero />
      <FeaturedProducts />
      <SizesSection />
      <LowPrice />
      <RecentlyAdded />
    </div>
  )
}
