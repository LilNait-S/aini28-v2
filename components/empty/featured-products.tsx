import { Package } from "lucide-react"

export default function FeaturedProductsEmptyState() {
  return (
    <div className="w-full py-12 flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <Package className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium mb-2">No hay peluches destacados</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        Próximamente mostraremos aquí nuestros peluches más populares y
        recomendados.
      </p>
      <p className="text-sm text-muted-foreground">
        Vuelve pronto para descubrir nuestros mejores peluches.
      </p>
    </div>
  )
}
