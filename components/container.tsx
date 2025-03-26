import { cn } from "@/lib/utils"

export function Container({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("container max-w-7xl mx-auto px-6 lg:px-0", className)}>
      {children}
    </div>
  )
}
