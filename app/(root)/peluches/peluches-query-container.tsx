"use client"

import { getAllPeluches } from "@/lib/actions/product"
import { use } from "react"
import { PeluchesContainer } from "./peluches-container"
import { PaginationContainer } from "@/components/pagination-container"
import { parseAsInteger, useQueryState } from "nuqs"

interface PeluchesQueryContainerProps {
  peluchesPromise: ReturnType<typeof getAllPeluches>
}

export function PeluchesQueryContainer({
  peluchesPromise,
}: PeluchesQueryContainerProps) {
  const { products, totalPages } = use(peluchesPromise)

  const [currentPage, setCurrentPage] = useQueryState(
    "page",
    parseAsInteger
      .withOptions({ history: "replace", shallow: false })
      .withDefault(1)
  )

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }
  return (
    <div className="flex flex-col space-y-6">
      <PeluchesContainer peluches={products} />
      <PaginationContainer
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
