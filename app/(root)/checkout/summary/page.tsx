"use client"

import { useCartState } from "@/lib/states/shopping-car"
import { CheckoutForm } from "./checkout-form"
import { OrderSummary } from "./order-summary"
import { ProductList } from "./product-list"

export default function Summary() {
  const { cartItems, totalPrice } = useCartState()
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">
        Resumen de Compra
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md border border-border p-6">
            <h2 className="text-xl font-semibold mb-4">
              Productos en tu Carrito
            </h2>
            <ProductList products={cartItems} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md border border-border p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
            <OrderSummary
              subtotal={totalPrice}
              shipping={0}
              total={totalPrice}
            />
          </div>

          <div className="bg-white rounded-lg shadow-md border border-border p-6">
            <h2 className="text-xl font-semibold mb-4">Datos de Contacto</h2>
            <CheckoutForm />
          </div>
        </div>
      </div>
    </div>
  )
}
