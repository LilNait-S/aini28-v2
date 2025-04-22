import { ProductCart } from "@/lib/states/shopping-car"
import { urlFor } from "@/sanity/lib/image"
import Link from "next/link"

interface ProductListProps {
  products: ProductCart[]
}

export function ProductList({ products }: ProductListProps) {
  return (
    <div className="divide-y divide-gray-200">
      {products.map(
        ({
          _id,
          finalPrice,
          images,
          name,
          price,
          qty,
          selectedSize,
          salePrice,
          slug,
        }) => (
          <div key={_id + selectedSize} className="py-4 flex">
            <Link
              href={`/peluches/${slug}`}
              className="flex-shrink-0 mr-4 mb-4 sm:mb-0"
            >
              <img
                src={
                  images?.[0]
                    ? urlFor(images[0]).width(400).height(400).url()
                    : "/placeholder-image.webp"
                }
                alt={images?.[0]?.alt || "Imagen del producto"}
                width={150}
                height={150}
                className="rounded-xl object-cover"
              />
            </Link>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold">{name}</h3>
              <div className="mt-2 flex flex-col sm:flex-row sm:justify-between">
                <div className="text-sm text-muted-foreground mb-2 sm:mb-0">
                  <span>Cantidad: {qty}</span>
                </div>
                <div className="text-sm">
                  {salePrice ? (
                    <div className="flex flex-col">
                      <div className="flex items-center justify-end space-x-1 mb-2 sm:mb-0">
                        <span className="text-muted-foreground">Antes: </span>
                        <p className="text-sm line-through text-muted-foreground">
                          S/.{price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex text-xl items-center justify-end space-x-1 mb-2 sm:mb-0 text-primary font-bold">
                        <span>Oferta: </span>
                        <span>S/.{salePrice.toFixed(2)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end space-x-1 mb-2 sm:mb-0">
                      <span className="text-muted-foreground">
                        Precio unitario:{" "}
                      </span>
                      <span className="font-medium">S/.{price.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-2 text-right">
                <span className="text-muted-foreground">Subtotal: </span>
                <span className="font-semibold">
                  S/.{(finalPrice * qty).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  )
}
