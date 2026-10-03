"use client";

import { CheckCircle } from "lucide-react";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function ConfirmacionPedido() {
  // Estado para verificar si el componente está montado en el cliente
  const [isClient, setIsClient] = useState(false);

  // Activar el estado después de que el componente se monte
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Obtener el tamaño de la ventana
  const { width, height } = useWindowSize();

  return (
    <div className="container max-w-5xl mx-auto py-12 px-4 h-[calc(100dvh-10rem)] flex justify-center items-center">
      {/* Renderizar Confetti solo en el cliente */}
      {isClient && <Confetti width={width - 30} height={height} />}
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-center">¡Solicitud recibida!</h1>
        <p className="text-muted-foreground text-center mt-2">
          Recibimos tu solicitud. Coordinaremos contigo la venta, el pago y el
          envío. Revisa tu correo para ver el resumen.
        </p>
      </div>
    </div>
  );
}
