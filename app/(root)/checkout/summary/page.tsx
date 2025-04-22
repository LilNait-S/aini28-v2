"use client"

import { useCartState } from "@/lib/states/shopping-car"
import { CheckoutForm } from "./checkout-form"
import { OrderSummary } from "./order-summary"
import { ProductList } from "./product-list"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Container } from "@/components/container"

export default function Summary() {
  const { cartItems, totalPrice } = useCartState()

  if (cartItems.length === 0) {
    return (
      <Container className="h-[calc(100dvh_-_22rem)] flex flex-col items-center justify-center">
        <h1 className="text-2xl md:text-3xl font-bold !mb-0">
          Tu carrito está vacío
        </h1>
        <p className="text-muted-foreground mb-6">
          Parece que no has agregado productos a tu carrito aún.
        </p>
        <Link
          href="/peluches"
          className="text-primary font-semibold hover:underline"
        >
          Ir a la tienda
        </Link>
      </Container>
    )
  }

  return (
    <Container className="pb-20">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">
        Resumen de Compra
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
        <div className="order-2 lg:order-1 col-span-2 lg:border-r-1 lg:border-border lg:pr-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Productos en tu Carrito
            </h2>
            <ProductList products={cartItems} />
          </div>
        </div>

        <div className="order-1 lg:order-2 flex flex-col gap-12">
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
    </Container>
  )
}
