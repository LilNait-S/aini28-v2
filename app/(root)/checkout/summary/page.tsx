"use client"

import { useCartState } from "@/lib/states/shopping-car"
import { CheckoutForm } from "./checkout-form"
import { OrderSummary } from "./order-summary"
import { ProductList } from "./product-list"
import { Separator } from "@/components/ui/separator"

export default function Summary() {
  const { cartItems, totalPrice } = useCartState()
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">
        Resumen de Compra
      </h1>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 border-r-1 border-border pr-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Productos en tu Carrito
            </h2>
            <ProductList products={cartItems} />
          </div>
        </div>

        <div className="flex flex-col gap-12">
          <div>
            <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
            <OrderSummary
              subtotal={totalPrice}
              shipping={0}
              total={totalPrice}
            />
          </div>

          <Separator />

          <div>
            <h2 className="text-xl font-semibold mb-4">Datos de Contacto</h2>
            <CheckoutForm />
          </div>
        </div>
      </div>
    </div>
  )
}
