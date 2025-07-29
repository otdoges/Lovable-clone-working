import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
}

export function LoadingSpinner({ className, size = "md" }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-[var(--primary)]",
        sizeMap[size],
        className
      )}
    />
  )
}

export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex space-x-1", className)}>
      <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--muted-foreground)]" />
      <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--muted-foreground)] delay-75" />
      <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--muted-foreground)] delay-150" />
    </div>
  )
}