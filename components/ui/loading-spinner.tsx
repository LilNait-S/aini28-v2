import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export function LoadingSpinner({
  size = 24,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <div className={cn(`flex justify-center items-center`, className)}>
      <Loader2 className="animate-spin" size={size} />
    </div>
  )
}
