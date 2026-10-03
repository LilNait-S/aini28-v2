import { ProductCard } from "@/components/product-card";
import { Product } from "@/types/catalog";

interface PeluchesContainerProps {
  peluches: Product[];
  preferredSize?: string;
}

export function PeluchesContainer({
  peluches,
  preferredSize,
}: PeluchesContainerProps) {
  return (
    <main className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {peluches.map((product) => (
        <ProductCard
          key={`${product.id}-${preferredSize || ""}`}
          {...product}
          preferredSize={preferredSize}
          className="w-full h-full"
        />
      ))}
    </main>
  );
}
