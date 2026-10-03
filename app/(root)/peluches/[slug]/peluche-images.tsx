import type { Product } from "@/types/catalog";
export function PelucheImages({ peluche }: { peluche: Product }) {
  return (
    <div className="flex flex-col items-center space-y-4">
    <picture className="rounded-2xl overflow-hidden w-full">
      <img
        src={peluche.imageUrl}
        alt={peluche.name}
        width={800}
        height={800}
        className="h-full w-full object-cover aspect-square"
      />
    </picture>
    </div>
  );
}
