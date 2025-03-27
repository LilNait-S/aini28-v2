import { TagIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BudgetProductsEmptyState() {
  return (
    <div className="w-full rounded-lg p-6 md:p-8">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <TagIcon className="h-8 w-8 text-muted-foreground" />
        </div>

        <h3 className="mb-2 text-2xl font-bold">Por menos de S/.50</h3>

        <p className="mb-6 max-w-md text-muted-foreground">
          Próximamente encontrarás aquí productos económicos a precios
          increíbles.
        </p>

        <Button variant="outline">Ver otras ofertas</Button>
      </div>
    </div>
  )
}
