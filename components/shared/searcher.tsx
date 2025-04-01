"use client"

import { useDebounce } from "@/hooks/use-debounce"
import { getAllPeluches } from "@/lib/actions/product"
import { urlFor } from "@/sanity/lib/image"
import { Product } from "@/sanity/types"
import { Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"
import { LoadingSpinner } from "../ui/loading-spinner"
import { cn } from "@/lib/utils"

export function Searcher() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const handleSearchClick = () => {
    setIsExpanded(true)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 300)
  }

  const handleSearch = async (term: string) => {
    if (term.trim() === "") {
      setSearchResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    try {
      console.log("term", term)
      const results = await getAllPeluches({
        search: `*${term}*`,
        pageSize: 10,
      })
      console.log("products", results.products)
      setSearchResults(results.products)
    } catch (error) {
      console.error("Error fetching search results:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (debouncedSearchTerm) {
      handleSearch(debouncedSearchTerm)
    }
  }, [debouncedSearchTerm])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        isExpanded
      ) {
        setIsExpanded(false)
        setSearchResults([])
        setSearchTerm("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isExpanded])

  return (
    <div className="relative" ref={searchContainerRef}>
      <div className="flex items-center">
        <div
          className={`flex items-center bg-border/50 rounded-full overflow-hidden transition-all duration-300 ${
            isExpanded ? "w-64" : "w-10"
          }`}
        >
          <Button
            type="button"
            onClick={handleSearchClick}
            className="p-2 focus:outline-none bg-gray-900 hover:bg-gray-900/80 rounded-full"
            aria-label="Search"
          >
            <Search size={20} />
          </Button>

          <input
            ref={inputRef}
            type="text"
            placeholder="Unicornio, oso, doraemon..."
            className={`outline-none px-2 py-1 w-full transition-all text-sm ${
              isExpanded ? "opacity-100" : "opacity-0 w-0"
            }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsExpanded(true)}
          />
        </div>
      </div>

      {isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10 p-8 text-center">
          <LoadingSpinner />
        </div>
      )}

      {searchResults.length > 0 && isExpanded && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10">
          <ScrollArea
            className={cn("h-fit w-full", searchResults.length > 4 && "h-72")}
          >
            <ul>
              {searchResults.map((product) => (
                <Link
                  href={`/peluches/${product.slug?.current}`}
                  key={product._id}
                  className="border-b last:border-b-0 cursor-pointer"
                  onClick={() => {
                    setIsExpanded(false)
                    setSearchResults([])
                    setSearchTerm("")
                  }}
                >
                  <div className="flex items-center w-full p-2 hover:bg-gray-50 text-left">
                    <img
                      src={
                        product.images?.[0]
                          ? urlFor(product.images[0])
                              .width(400)
                              .height(400)
                              .url()
                          : "/placeholder-image.webp"
                      }
                      alt={product.images?.[0]?.alt || "Imagen del producto"}
                      width={50}
                      height={50}
                      className="mr-3 rounded-md"
                    />
                    <div>
                      <p className="font-semibold text-sm text-balance">
                        {product.name}
                      </p>
                      {/* <div className="flex gap-1">
                        {product.sizePricing?.map(({ size, _key }) => {
                          return (
                            <Badge
                              key={_key}
                              variant="secondary"
                              className="text-xs py-1 px-4"
                            >
                              {parseSize(size).label}
                            </Badge>
                          )
                        })}
                      </div> */}
                    </div>
                  </div>
                </Link>
              ))}
            </ul>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
