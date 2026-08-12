import { Container } from "@/components/container"
import { buttonVariants } from "@/components/ui/button"
import { Home, Search } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] items-center justify-center py-20">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted text-5xl">
          🧸
        </div>

        <p className="mb-2 text-6xl font-bold text-primary">404</p>

        <h1 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
          No encontramos este peluche
        </h1>

        <p className="mb-8 max-w-md text-muted-foreground">
          Es posible que el producto ya no esté disponible o que el enlace sea
          incorrecto. Explora el resto de nuestra colección.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/" className={buttonVariants({ variant: "default" })}>
            <Home className="mr-2 h-4 w-4" />
            Ir al inicio
          </Link>
          <Link
            href="/peluches"
            className={buttonVariants({ variant: "outline" })}
          >
            <Search className="mr-2 h-4 w-4" />
            Ver todos los peluches
          </Link>
        </div>
      </div>
    </Container>
  )
}
