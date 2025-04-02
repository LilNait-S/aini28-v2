interface OrderSummaryProps {
  subtotal: number
  shipping: number
  total: number
}

export function OrderSummary({ subtotal, total }: OrderSummaryProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Subtotal</span>
        <span>S/.{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Gastos de envío</span>
        <span>Por definir</span>
      </div>
      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span className="text-xl">S/.{total.toFixed(2)}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">IGV incluido</p>
      </div>
    </div>
  )
}
