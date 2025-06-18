import { OrderPayload } from "@/types/order"
import { useState } from "react"
import axios from "axios"

export const useOrder = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const createOrder = async (payload: OrderPayload) => {
    setLoading(true)
    setError(null)
    try {
      // // Crear la orden
      // await genericAuthRequest("post", `/orders`, payload)

      // Enviar el correo
      await axios.post("/api/send-email", payload)

      if (onSuccess) onSuccess()
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createOrder, loading, error }
}
