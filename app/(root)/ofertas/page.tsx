import { Container } from "@/components/container"
import { getAllPeluches } from "@/lib/actions/product"
import { getPeluchesSchema } from "@/lib/validations/search/products"
import { Params } from "@/types/params"
import { FiltersToolbar } from "../peluches/filters-toolbar"
import { PeluchesQueryContainer } from "../peluches/peluches-query-container"

export default async function Ofertas({ searchParams }: Params) {
  const search = getPeluchesSchema.parse(await searchParams)
  const peluches = getAllPeluches({ hasSalePrice: true, ...search })

  return (
    <Container>
      <section className="space-y-8 pt-4 pb-20">
        <FiltersToolbar />
        <PeluchesQueryContainer peluchesPromise={peluches} />
      </section>
    </Container>
  )
}
