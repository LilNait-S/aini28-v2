import { Container } from "@/components/container"
import { getAllPeluches } from "@/lib/actions/product"
import { getPeluchesSchema } from "@/lib/validations/search/products"
import { Params } from "@/types/params"
import { FiltersToolbar } from "./filters-toolbar"
import { PeluchesQueryContainer } from "./peluches-query-container"
import { Suspense } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default async function Peluches({ searchParams }: Params) {
  const search = getPeluchesSchema.parse(await searchParams)
  const peluches = getAllPeluches(search)

  return (
    <Container>
      <section className="space-y-8 pt-4 pb-20">
        <FiltersToolbar />
        <Suspense fallback={<LoadingSpinner />}>
          <PeluchesQueryContainer peluchesPromise={peluches} />
        </Suspense>
      </section>
    </Container>
  )
}
