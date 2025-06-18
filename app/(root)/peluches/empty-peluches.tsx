import { Package } from "lucide-react"

export function EmptyView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-8 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Package className="w-8 h-8 text-gray-400" />
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        No hay peluches disponibles
      </h2>

      <p className="text-gray-500 mb-6 max-w-sm">
        No se encontraron items en este momento
      </p>
    </div>
  )
}
