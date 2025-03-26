import { ProductCard } from "@/components/product-card"
import { PRODUCT } from "@/constants/products"
import { FiltersToolbar } from "./filters-toolbar"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Container } from "@/components/container"

export default function Peluches() {
  return (
    <Container>
      <section className="space-y-8 pt-4 pb-20">
        <FiltersToolbar />
        <main className="grid grid-cols-4 gap-10">
          {PRODUCT.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              className="w-full h-full"
            />
          ))}
        </main>
        <footer className="w-full flex justify-end items-end">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </footer>
      </section>
    </Container>
  )
}
