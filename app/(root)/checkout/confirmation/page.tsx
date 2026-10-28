"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  loadReceipt,
  takePendingHandoff,
  type CheckoutReceipt,
} from "@/lib/checkout-receipt";

export default function ConfirmacionPedido() {
  const [receipt, setReceipt] = useState<CheckoutReceipt | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReceipt(loadReceipt());
    setReady(true);
    const timer = window.setTimeout(() => {
      const saved = loadReceipt();
      if (takePendingHandoff() && saved?.whatsappUrl)
        window.location.assign(saved.whatsappUrl);
    }, 700);
    return () => window.clearTimeout(timer);
  }, []);

  async function copySummary() {
    if (!receipt) return;
    try {
      await navigator.clipboard.writeText(receipt.message);
      toast.success("Resumen copiado");
    } catch {
      toast.error(
        "No pudimos copiarlo. Selecciona el texto del resumen para copiarlo.",
      );
    }
  }

  return (
    <main className="container max-w-2xl mx-auto py-12 px-4 space-y-6">
      <div className="text-center space-y-3">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
        <h1 className="text-3xl font-bold">
          {receipt
            ? "¡Solicitud registrada!"
            : "Continúa tu compra por WhatsApp"}
        </h1>
        {receipt ? (
          <p className="text-muted-foreground">
            Tu solicitud ya está en nuestra tienda. Abre WhatsApp y pulsa enviar
            para coordinar el pago y la entrega.
          </p>
        ) : ready ? (
          <p className="text-muted-foreground">
            No hay un resumen reciente en esta pestaña. Si ya enviaste tu
            solicitud, sigue registrada; no necesitas repetirla. Puedes
            consultar el resumen en tu correo.
          </p>
        ) : (
          <p>Cargando resumen…</p>
        )}
      </div>
      {receipt ? (
        <>
          <p className="text-sm break-all text-center">
            Solicitud: {receipt.id}
          </p>
          {receipt.whatsappUrl ? (
            <Button asChild className="w-full h-auto whitespace-normal py-3">
              <a href={receipt.whatsappUrl} rel="noreferrer">
                <MessageCircle className="mr-2 h-5 w-5 shrink-0" />
                Abrir WhatsApp y enviar resumen
              </a>
            </Button>
          ) : (
            <p role="status">
              WhatsApp no está disponible en este momento. Tu solicitud está
              registrada; conserva el resumen de abajo.
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            El mensaje se abrirá preparado. Debes pulsar enviar en WhatsApp para
            que llegue a la tienda. Si vuelves a esta página, podrás abrirlo
            otra vez.
          </p>
          <Button variant="outline" className="w-full" onClick={copySummary}>
            Copiar resumen
          </Button>
          <pre className="whitespace-pre-wrap break-words rounded-xl border bg-muted/40 p-4 text-sm font-sans">
            {receipt.message}
          </pre>
          <p className="text-sm text-muted-foreground">
            {receipt.emailSent
              ? "También enviamos el resumen a tu correo."
              : "No pudimos enviar el correo de confirmación. Conserva este resumen."}{" "}
            Esta solicitud no reserva productos ni confirma una venta.
          </p>
        </>
      ) : null}
      <Link className="block text-center underline" href="/peluches">
        Volver al catálogo
      </Link>
    </main>
  );
}
