"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useCartState } from "@/lib/states/shopping-car"
import { urlFor } from "@/sanity/lib/image"
import { parseSize } from "@/utils/parse-size"
import { ChevronDown, ChevronUp, ShoppingBag, Trash2 } from "lucide-react"
import { Separator } from "../ui/separator"
import { ScrollArea } from "../ui/scroll-area"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState } from "react"

export function Bag() {
  const {
    cartItems,
    totalPrice,
    totalQuantities,
    toggleCartItemQuantity,
    onRemove,
  } = useCartState()

  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" className="rounded-full">
          <ShoppingBag />
          <span className="text-primary">
            {totalQuantities > 99 ? "99+" : totalQuantities}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent className="gap-0">
        <SheetHeader className="p-6">
          <SheetTitle className="text-2xl font-bold">
            Resumen de tu Compra
          </SheetTitle>
          <SheetDescription>
            Estos son los peluches que elegiste. ¿Listo para confirmar?
          </SheetDescription>
        </SheetHeader>
        <div className="h-full flex justify-center items-center">
          {cartItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              Tu carrito está vacio. Agrega algunos peluches para empezar a
              comprar.
            </p>
          ) : (
            <div className="px-6 flex flex-col justify-between h-full w-full">
              <ScrollArea className="max-h-[60vh]">
                <div className="space-y-4 pr-4">
                  {cartItems.map(
                    (
                      {
                        _id,
                        qty,
                        selectedSize,
                        price,
                        salePrice,
                        finalPrice,
                        images,
                        name,
                      },
                      i
                    ) => (
                      <div
                        key={`${_id + selectedSize}`}
                        className={cn(
                          "flex flex-col gap-2 pb-4",
                          cartItems.length > 1 &&
                            i !== cartItems.length - 1 &&
                            "border-b"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img
                              src={
                                images?.[0]
                                  ? urlFor(images[0])
                                      .width(400)
                                      .height(400)
                                      .url()
                                  : "/placeholder-image.webp"
                              }
                              alt={images?.[0]?.alt || "Imagen del producto"}
                              width={70}
                              height={70}
                              className="rounded-xl object-cover"
                            />
                            <div>
                              <h3 className="font-semibold line-clamp-1">
                                {name}
                              </h3>
                              <span className="text-primary">
                                {parseSize(selectedSize).label}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => onRemove(_id, selectedSize)}
                            aria-label="Remove item from cart"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="inline-flex -space-x-px rounded-full rtl:space-x-reverse">
                            <Button
                              className="rounded-none shadow-none first:rounded-s-full last:rounded-e-full focus-visible:z-10"
                              variant="secondary"
                              aria-label="Decrease quantity"
                              disabled={qty <= 1}
                              onClick={() =>
                                toggleCartItemQuantity({
                                  _id,
                                  selectedSize,
                                  value: "dec",
                                })
                              }
                            >
                              <ChevronDown
                                size={16}
                                strokeWidth={2}
                                aria-hidden="true"
                              />
                            </Button>
                            <span className="flex items-center bg-secondary w-7 justify-center px-1 text-sm">
                              {qty}
                            </span>
                            <Button
                              className="rounded-none shadow-none first:rounded-s-full last:rounded-e-full focus-visible:z-10"
                              variant="secondary"
                              aria-label="Increase quantity"
                              disabled={qty >= 50}
                              onClick={() =>
                                toggleCartItemQuantity({
                                  _id,
                                  selectedSize,
                                  value: "inc",
                                })
                              }
                            >
                              <ChevronUp
                                size={16}
                                strokeWidth={2}
                                aria-hidden="true"
                              />
                            </Button>
                          </div>
                          <div className="flex gap-2 items-center">
                            {salePrice !== undefined && (
                              <p className="text-sm line-through text-muted-foreground">
                                S/.{price.toFixed(2)}
                              </p>
                            )}
                            <div className="font-medium">
                              S/.{finalPrice.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </ScrollArea>
              <div className="flex flex-col">
                <Separator className="my-4" />
                <SheetFooter className="space-y-4">
                  <div className="flex justify-between mb-0">
                    <span>Total de artículos</span>
                    <span>{totalQuantities}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Precio total</span>
                    <span>S/.{totalPrice.toFixed(2)}</span>
                  </div>
                  <Link
                    href={`/checkout/summary`}
                    className={cn(buttonVariants(), "w-full")}
                    onClick={() => setOpen(false)}
                    aria-label="Proceed to checkout"
                  >
                    Finalizar compra
                  </Link>
                </SheetFooter>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
