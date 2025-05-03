import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { redirect } from "next/navigation"

export default function ConfirmacionPedido() {
  const orderId = 1

  // Redireccionar si no hay ID de pedido
  if (!orderId) {
    redirect("/")
  }

  return (
    <div className="container max-w-5xl mx-auto py-12 px-4">
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-center">¡Pedido Confirmado!</h1>
        <p className="text-muted-foreground text-center mt-2">
          Gracias por tu compra. Tu pedido ha sido procesado correctamente.
        </p>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Detalles del Pedido</CardTitle>
          <CardDescription>Pedido #{orderId}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">Resumen del Pedido</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Fecha del Pedido
                </p>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Método de Pago</p>
                <p>Tarjeta de crédito</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Información de Envío</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Método de Envío</p>
                <p>Envío estándar</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tiempo Estimado</p>
                <p>3-5 días hábiles</p>
              </div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg mt-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>$XXX.XX</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Envío</span>
              <span>$XX.XX</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>$XXX.XX</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/">Volver a la Tienda</Link>
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href={`/mi-cuenta/pedidos/${orderId}`}>
              Ver Detalles del Pedido
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-8 text-center">
        <h2 className="text-xl font-semibold mb-4">¿Qué sigue?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Confirmación por Email</h3>
            <p className="text-sm text-muted-foreground">
              Recibirás un email con los detalles de tu pedido.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Seguimiento del Envío</h3>
            <p className="text-sm text-muted-foreground">
              Te enviaremos un código de seguimiento cuando tu pedido sea
              despachado.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Soporte al Cliente</h3>
            <p className="text-sm text-muted-foreground">
              ¿Tienes preguntas? Contáctanos en soporte@tutienda.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
