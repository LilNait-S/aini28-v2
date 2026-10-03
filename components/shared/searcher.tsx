"use client";
import { useDebounce } from "@/hooks/use-debounce";
import { getAllPeluches } from "@/lib/actions/product";
import type { Product } from "@/types/catalog";
import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { LoadingSpinner } from "../ui/loading-spinner";
export function Searcher() {
  const [expanded, setExpanded] = useState(false);
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const debounced = useDebounce(term, 500);
  useEffect(() => {
    let current = true;
    if (!expanded || !debounced.trim() || term !== debounced) {
      setResults([]);
      setLoading(false);
      return () => {
        current = false;
      };
    }
    setLoading(true);
    getAllPeluches({ search: debounced.trim(), pageSize: 10 })
      .then(({ products }) => {
        if (current) setResults(products);
      })
      .catch(() => {
        if (current) setResults([]);
      })
      .finally(() => {
        if (current) setLoading(false);
      });
    return () => {
      current = false;
    };
  }, [term, debounced, expanded]);
  useEffect(() => {
    const dismiss = (event: MouseEvent) => {
      if (!container.current?.contains(event.target as Node)) {
        setExpanded(false);
        setTerm("");
        setResults([]);
      }
    };
    document.addEventListener("mousedown", dismiss);
    return () => document.removeEventListener("mousedown", dismiss);
  }, []);
  return (
    <div className="relative" ref={container}>
      <div className="flex items-center bg-border/50 rounded-full overflow-hidden">
        <Button
          type="button"
          onClick={() => {
            setExpanded(true);
            input.current?.focus();
          }}
          className="p-2 bg-gray-900 hover:bg-gray-900/80 rounded-full"
          aria-label="Buscar"
        >
          <Search size={20} />
        </Button>
        <input
          ref={input}
          placeholder="Unicornio, oso, doraemon..."
          aria-label="Buscar peluches"
          className={
            expanded
              ? "outline-none px-2 py-1 w-36 md:w-56 text-sm"
              : "w-0 opacity-0"
          }
          value={term}
          onFocus={() => setExpanded(true)}
          onChange={(e) => setTerm(e.target.value)}
        />
      </div>
      {expanded && loading && (
        <div className="absolute top-full left-0 mt-1 bg-white border rounded-md z-50 p-8">
          <LoadingSpinner />
        </div>
      )}
      {expanded && results.length > 0 && !loading && (
        <div className="absolute top-full right-0 w-64 max-w-[90vw] mt-1 bg-white border rounded-md z-50">
          <ScrollArea className="max-h-72">
            <ul>
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/peluches/${p.slug}`}
                    className="flex items-center p-2 border-b hover:bg-gray-50"
                    onClick={() => {
                      setExpanded(false);
                      setTerm("");
                      setResults([]);
                    }}
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      width={50}
                      height={50}
                      className="mr-3 rounded-md"
                    />
                    <span className="text-sm font-semibold">{p.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
