import { OrderPayload } from "@/types/order"
import { useState } from "react"
import { genericAuthRequest } from "./base"

export const useOrder = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const createOrder = async (payload: OrderPayload) => {
    setLoading(true)
    setError(null)
    try {
      await genericAuthRequest("post", `/orders`, payload)
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
