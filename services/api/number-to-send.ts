import { NumberToSendMessage } from "@/types/number-to-send"
import { useCallback, useEffect, useState } from "react"
import { genericAuthRequest } from "./base"

export const useGetAllNumbersToSendMessages = () => {
  const [data, setData] = useState<NumberToSendMessage[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res: NumberToSendMessage[] = await genericAuthRequest(
        "get",
        `/whatsapp`
      )
      setData(res)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

export const useCreateNumberToSendMessage = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const createNumber = async (
    payload: Partial<Omit<NumberToSendMessage, "id" | "chatId" | "createdAt">>
  ) => {
    setLoading(true)
    setError(null)
    try {
      const res: NumberToSendMessage = await genericAuthRequest(
        "post",
        `/whatsapp`,
        payload
      )
      if (onSuccess) onSuccess()
      return res
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createNumber, loading, error }
}

export const useUpdateNumberToSendMessage = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const updateNumber = async ({
    id,
    payload,
  }: {
    id: number
    payload: Partial<Omit<NumberToSendMessage, "id" | "chatId" | "createdAt">>
  }) => {
    setLoading(true)
    setError(null)
    try {
      const res: NumberToSendMessage = await genericAuthRequest(
        "patch",
        `/whatsapp/${id}`,
        payload
      )
      if (onSuccess) onSuccess()
      return res
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { updateNumber, loading, error }
}

export const useDeleteNumberToSendMessage = (onSuccess?: () => void) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<unknown>(null)
  
    const deleteNumber = async (id: number) => {
      setLoading(true)
      setError(null)
      try {
        await genericAuthRequest("delete", `/whatsapp/${id}`)
        if (onSuccess) onSuccess()
      } catch (err) {
        setError(err)
        throw err
      } finally {
        setLoading(false)
      }
    }
  
    return { deleteNumber, loading, error }
  }