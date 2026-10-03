import { OrderPayload } from "@/types/order";
import { useState } from "react";
import axios from "axios";
import { useCartState } from "@/lib/states/shopping-car";

export const useOrder = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const createOrder = async (payload: OrderPayload) => {
    setLoading(true);
    setError(null);
    try {
      // // Crear la orden
      // await genericAuthRequest("post", `/orders`, payload)

      // Enviar el correo
      await axios.post("/api/send-email", payload);

      if (onSuccess) onSuccess();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.quote) {
        useCartState.getState().replaceCart(err.response.data.quote.cartItems);
      }
      setError(err);
      throw new Error(
        axios.isAxiosError(err)
          ? err.response?.data?.message ||
            "No pudimos enviar la solicitud. Intenta nuevamente."
          : "No pudimos enviar la solicitud. Intenta nuevamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, loading, error };
};
