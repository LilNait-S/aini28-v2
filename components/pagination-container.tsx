"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useSearchParams } from "next/navigation";

type PaginationProps = {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
};

export function PaginationContainer({
  currentPage,
  onPageChange,
  totalPages,
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageHref = (page: number) => {
    const query = new URLSearchParams(searchParams.toString());
    query.set("page", String(page));
    return `${pathname}?${query.toString()}`;
  };

  return (
    <Pagination>
      <PaginationContent>
        {/* Botón "Anterior" */}
        <PaginationItem>
          <PaginationPrevious
            href={pageHref(Math.max(1, currentPage - 1))}
            aria-disabled={currentPage <= 1}
            aria-label="Página anterior"
            disabled={currentPage <= 1}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
          />
        </PaginationItem>

        {/* Páginas */}
        {Array.from({ length: totalPages }, (_, index) => {
          const pageNumber = index + 1;
          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href={pageHref(pageNumber)}
                isActive={currentPage === pageNumber}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(pageNumber);
                }}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Puntos suspensivos si hay muchas páginas */}
        {totalPages > 5 && <PaginationEllipsis />}

        {/* Botón "Siguiente" */}
        <PaginationItem>
          <PaginationNext
            href={pageHref(Math.min(totalPages, currentPage + 1))}
            aria-disabled={currentPage >= totalPages}
            aria-label="Página siguiente"
            disabled={currentPage >= totalPages}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
