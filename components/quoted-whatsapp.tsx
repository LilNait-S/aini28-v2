"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import type { ProductCart } from "@/lib/states/shopping-car";

type Item = Pick<ProductCart, "_id" | "selectedSize" | "qty" | "finalPrice">;
export function QuotedWhatsApp({
  items,
  onQuoted,
  compact = false,
}: {
  items: Item[];
  onQuoted?: (items: ProductCart[]) => void;
  compact?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [prepared, setPrepared] = useState<{
    key: string;
    url: string;
    total: number;
  } | null>(null);
  const key = JSON.stringify(items);
  const currentKey = useRef(key);
  currentKey.current = key;
  const router = useRouter();
  async function prepare(open = false) {
    setLoading(true);
    setPrepared(null);
    try {
      const response = await fetch("/api/catalog/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: items }),
      });
      const quote = await response.json();
      if (!response.ok) throw new Error(quote.message);
      if (currentKey.current !== key) return;
      onQuoted?.(quote.cartItems);
      // A second explicit click lets the customer review the fresh amount.
      const refreshedKey = onQuoted
        ? JSON.stringify(
            quote.cartItems.map((item: ProductCart) => ({
              _id: item._id,
              selectedSize: item.selectedSize,
              qty: item.qty,
              finalPrice: item.finalPrice,
            })),
          )
        : key;
      setPrepared({
        key: refreshedKey,
        url: quote.whatsappUrl,
        total: quote.total,
      });
      if (quote.changed) {
        toast.info(
          "El precio cambió. Revisa el total actualizado antes de continuar.",
        );
        router.refresh();
      } else if (open) window.location.assign(quote.whatsappUrl);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No pudimos consultar los precios. Intenta nuevamente.",
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className={compact ? "w-full border-0 shadow-none text-sm text-muted-foreground font-normal h-auto p-0 hover:bg-transparent" : "w-full"}
        disabled={loading || !items.length}
        onClick={() => prepare()}
      >
        {compact && <MessageCircle className="size-3.5" />}
        {loading ? "Consultando precios..." : compact ? "Chat" : "Preparar consulta por WhatsApp"}
      </Button>
      {prepared && prepared.key === key && (
        <div className="rounded-xl border p-3 space-y-2">
          <p className="text-sm">
            Total referencial actualizado:{" "}
            <strong>S/. {prepared.total.toFixed(2)}</strong>
          </p>
          <p className="text-sm text-muted-foreground">
            Coordinaremos la venta y el envío contigo.
          </p>
          <Button asChild className="w-full">
            <a
              href={prepared.url}
              onClick={(event) => {
                event.preventDefault();
                if (!loading) void prepare(true);
              }}
              aria-disabled={loading}
            >
              Continuar en WhatsApp
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
