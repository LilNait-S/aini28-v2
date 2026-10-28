import { receiptSchema, type CheckoutReceipt } from "@/lib/checkout-receipt";
import { OrderPayload } from "@/types/order";
import { useState } from "react";
import axios from "axios";
import { useCartState } from "@/lib/states/shopping-car";

export const useOrder = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  /** Records the Solicitud in Plush; resolves whether the email was sent. */
  const createOrder = async (payload: OrderPayload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post<CheckoutReceipt>(
        "/api/requests",
        payload,
      );
      if (onSuccess) onSuccess();
      return receiptSchema.parse(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        const cart = useCartState.getState();
        // Show the current prices, or drop what sold out, before a retry.
        if (data?.quote) cart.replaceCart(data.quote.cartItems);
        else if (Array.isArray(data?.unavailable))
          cart.replaceCart(
            cart.cartItems.filter(
              (item) => !data.unavailable.includes(item.selectedSize),
            ),
          );
      }
      setError(err);
      throw Object.assign(
        new Error(
          axios.isAxiosError(err)
            ? err.response?.data?.message ||
              "No pudimos enviar la solicitud. Intenta nuevamente."
            : "No pudimos enviar la solicitud. Intenta nuevamente.",
        ),
        // A rejected (4xx) request needs a new id; a network failure keeps it.
        { status: axios.isAxiosError(err) ? err.response?.status : undefined },
      );
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, loading, error };
};
