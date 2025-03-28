import { Container } from "@/components/container"
import { PelucheBreadcrumb } from "./peluche-breadcrumb"
import { PelucheClient } from "./peluche-client"
import { Params } from "@/types/params"
import { getPeluche } from "@/lib/actions/product"
import { PelucheImages } from "./peluche-images"

export default async function Peluche({ params }: Params) {
  const { slug } = await params
  const peluche = await getPeluche({ slug })
  const { name, code } = peluche

  return (
    <Container>
      <section className="flex flex-col">
        <header className="py-4">
          <PelucheBreadcrumb pelucheName={name} />
        </header>
        <main className="grid grid-cols-2 gap-12">
          <PelucheImages peluche={peluche} />
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <span>Aini28</span>
              <span>{code}</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">{name}</h1>
            <PelucheClient peluche={peluche} />
          </div>
        </main>
        <footer className="flex flex-col items-center justify-center py-4 my-20">
          <h3 className="text-3xl font-bold">Mas peluches bonitos para ti</h3>
        </footer>
      </section>
    </Container>
  )
}
