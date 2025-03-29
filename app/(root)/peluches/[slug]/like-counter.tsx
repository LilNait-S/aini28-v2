"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { toast } from "sonner"
import NumberFlow from "@number-flow/react"

interface LikeCounterProps {
  initialLikes?: number
}

export function LikeCounter({ initialLikes = 0 }: LikeCounterProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [hasLiked, setHasLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)

  // Manejar el bloqueo de likes
  useEffect(() => {
    const storedBlockTime = localStorage.getItem("likeBlockTime")
    if (storedBlockTime) {
      const blockTime = new Date(storedBlockTime).getTime()
      const currentTime = new Date().getTime()
      if (currentTime < blockTime) {
        setIsBlocked(true)
        const timeout = setTimeout(() => {
          setIsBlocked(false)
          localStorage.removeItem("likeBlockTime")
        }, blockTime - currentTime)
        return () => clearTimeout(timeout)
      }
    }
  }, [])

  const handleLike = () => {
    if (isBlocked) {
      toast.error(
        "Has alcanzado el límite de likes. Intenta de nuevo en 1 hora."
      )
      return
    }

    if (hasLiked) {
      setLikes((prev) => prev - 1)
      setHasLiked(false)
      setLikeCount((prev) => Math.max(prev - 1, 0))
      toast.error("¡Like removido!", {
        description: "Has quitado tu like del producto.",
      })
    } else {
      if (likeCount >= 10) {
        setIsBlocked(true)
        const blockTime = new Date(new Date().getTime() + 60 * 60 * 1000) // 1 hora
        localStorage.setItem("likeBlockTime", blockTime.toISOString())
        toast.error(
          "Has alcanzado el límite de likes. Intenta de nuevo en 1 hora."
        )
        return
      }

      setLikes((prev) => prev + 1)
      setHasLiked(true)
      setLikeCount((prev) => prev + 1)
      toast.success("¡Like agregado!", {
        description: "Has indicado que te gusta este producto.",
      })
    }
  }

  return (
    <div className="flex items-center gap-2 justify-center transition-color">
      <button
        onClick={handleLike}
        className={`flex cursor-pointer items-center justify-center w-8 h-8 rounded-full transition-color group`}
        disabled={isBlocked}
      >
        <Heart
          className={`w-5 h-5 transition-color group-hover:stroke-red-400 ${
            hasLiked ? "fill-red-400 stroke-red-400" : "stroke-gray-500"
          }`}
        />
      </button>
      <div className="flex items-center gap-2">
        <NumberFlow value={likes} className="text-gray-500" />
      </div>
    </div>
  )
}
