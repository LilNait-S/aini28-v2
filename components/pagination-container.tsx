"use client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { usePathname } from "next/navigation"

type PaginationProps = {
  currentPage: number
  onPageChange: (page: number) => void
  totalPages: number
}

export function PaginationContainer({
  currentPage,
  onPageChange,
  totalPages,
}: PaginationProps) {
  const pathname = usePathname()

  return (
    <Pagination>
      <PaginationContent>
        {/* Botón "Anterior" */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-label="Página anterior"
            disabled={currentPage <= 1}
            onClick={(e) => {
              e.preventDefault()
              if (currentPage > 1) onPageChange(currentPage - 1)
            }}
          />
        </PaginationItem>

        {/* Páginas */}
        {Array.from({ length: totalPages }, (_, index) => {
          const pageNumber = index + 1
          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href={`${pathname}?page=${pageNumber}`}
                isActive={currentPage === pageNumber}
                onClick={(e) => {
                  e.preventDefault()
                  onPageChange(pageNumber)
                }}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        {/* Puntos suspensivos si hay muchas páginas */}
        {totalPages > 5 && <PaginationEllipsis />}

        {/* Botón "Siguiente" */}
        <PaginationItem>
          <PaginationNext
            href="#"
            aria-label="Página siguiente"
            disabled={currentPage >= totalPages}
            onClick={(e) => {
              e.preventDefault()
              if (currentPage < totalPages) onPageChange(currentPage + 1)
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
