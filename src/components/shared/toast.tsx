import { useEffect } from "react"
import { AlertTriangle, CheckCircle2, X } from "lucide-react"

import { cn } from "@/lib/utils"

/** Bottom-centred confirmation strip, auto-dismissed after a few seconds. */
export function Toast({
  message,
  onClose,
  duration = 4000,
  variant = "success",
}: {
  message: string
  onClose: () => void
  duration?: number
  variant?: "success" | "error"
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  const isError = variant === "error"

  return (
    <div
      className={cn(
        "fixed bottom-8 left-1/2 z-[60] flex max-w-[90vw] -translate-x-1/2 items-center gap-6 rounded-xl border px-5 py-3.5 shadow-lg backdrop-blur",
        isError ? "border-destructive/30 bg-destructive/10" : "border-success/30 bg-success/10"
      )}
      role={isError ? "alert" : "status"}
    >
      <span className="flex items-center gap-3 font-medium">
        {isError ? (
          <AlertTriangle className="size-5 shrink-0 text-destructive" />
        ) : (
          <CheckCircle2 className="size-5 shrink-0 text-success" />
        )}
        {message}
      </span>
      <button
        type="button"
        onClick={onClose}
        className="flex shrink-0 items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        {isError ? "CLOSE" : "CANCEL"}
        <X className="size-4" />
      </button>
    </div>
  )
}
