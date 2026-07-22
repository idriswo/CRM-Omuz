import type { ReactNode } from "react"
import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

/** Replaces the browser's `window.confirm()` so destructive actions match the
 * rest of the UI (and stay usable in dark theme). */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  /** Red confirm button; turn off for neutral confirmations. */
  destructive = true,
  loading = false,
  /** Extra content shown between the description and the buttons. */
  children,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  loading?: boolean
  children?: ReactNode
  onConfirm: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-start gap-3">
            {destructive && (
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="size-5 text-destructive" />
              </span>
            )}
            <div className="min-w-0">
              <DialogTitle>{title}</DialogTitle>
              {description && <DialogDescription className="mt-1">{description}</DialogDescription>}
            </div>
          </div>
        </DialogHeader>

        {children}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
            disabled={loading}
          >
            {loading ? "Deleting…" : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
