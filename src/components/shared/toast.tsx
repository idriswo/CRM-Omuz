import { useEffect } from "react"
import { CheckCircle2, X } from "lucide-react"

/** Bottom-centred confirmation strip, auto-dismissed after a few seconds. */
export function Toast({
  message,
  onClose,
  duration = 4000,
}: {
  message: string
  onClose: () => void
  duration?: number
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  return (
    <div className="fixed bottom-8 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-6 rounded-xl border border-success/30 bg-success/10 px-5 py-3.5 shadow-lg backdrop-blur">
      <span className="flex items-center gap-3 font-medium">
        <CheckCircle2 className="size-5 text-success" />
        {message}
      </span>
      <button
        type="button"
        onClick={onClose}
        className="flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        CANCEL
        <X className="size-4" />
      </button>
    </div>
  )
}
