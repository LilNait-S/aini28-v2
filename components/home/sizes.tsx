import Link from "next/link";
import { readAllProducts } from "@/lib/catalog/plush";
import { getCatalogSizes } from "@/lib/actions/product";
export async function SizesSection() {
  const [products, sizes] = await Promise.all([
    readAllProducts(),
    getCatalogSizes(),
  ]);
  if (!sizes.length) return null;
  return (
    <section className="flex flex-col lg:flex-row gap-4">
      <div className="flex flex-col justify-center bg-slate-50 px-8 lg:px-12 rounded-4xl min-w-[200px] lg:min-w-[250px] min-h-[200px] lg:min-h-[250px]">
        <span className="text-accent-foreground text-center lg:text-left">Todos los</span>
        <span className="text-primary font-bold text-2xl lg:text-3xl text-center lg:text-left">Tamaños</span>
      </div>
      <div className="grid grid-cols-2 w-full gap-4">
        {sizes.map((size) => {
          const product = products.find((p) =>
            p.variants.some((v) => v.attributes["Tamaño"] === size),
          );
          return (
            <Link
              key={size}
              href={`/peluches?size=${encodeURIComponent(size)}&page=1`}
              className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 bg-slate-50 rounded-4xl p-4 items-center"
            >
              <img
                src={product?.imageUrl || "/placeholder-image.webp"}
                alt={`Peluches ${size}`}
                width={144}
                height={144}
                className="rounded-3xl w-24 h-24 lg:w-36 lg:h-36 object-cover"
              />
              <div className="flex flex-col w-full items-center">
                <span className="text-accent-foreground/50 text-sm lg:text-base">Peluches</span>
                <span className="text-primary font-bold text-xl lg:text-2xl">{size}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
