import { catalogMetadata } from "@/lib/seo/catalog-metadata";
import { Container } from "@/components/container";
import { getAllPeluches, getCatalogSizes } from "@/lib/actions/product";
import { getPeluchesSchema } from "@/lib/validations/search/products";
import { Params } from "@/types/params";
import { FiltersToolbar } from "../peluches/filters-toolbar";
import { PeluchesQueryContainer } from "../peluches/peluches-query-container";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export async function generateMetadata({ searchParams }: Params) {
  return catalogMetadata(
    "/ofertas",
    getPeluchesSchema.parse(await searchParams),
  );
}

export default async function Ofertas({ searchParams }: Params) {
  const search = getPeluchesSchema.parse(await searchParams);
  const peluches = getAllPeluches({ hasSalePrice: true, ...search });

  return (
    <Container>
      <section className="space-y-8 pt-4 pb-20">
        <FiltersToolbar sizes={await getCatalogSizes()} />
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center min-h-[500px] p-8 text-center">
              <LoadingSpinner />
            </div>
          }
        >
          <PeluchesQueryContainer peluchesPromise={peluches} preferredSize={search.size} />
        </Suspense>
      </section>
    </Container>
  );
}
