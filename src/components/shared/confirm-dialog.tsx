import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

/** Small confirmation modal used before destructive actions such as delete. */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  confirmLabel = "Yes, delete",
  cancelLabel = "Cancel",
  destructive = true,
  children,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  confirmLabel?: string
  cancelLabel?: string
  /** Red confirm button; turn off for neutral confirmations. */
  destructive?: boolean
  /** Extra content shown between the title and the buttons. */
  children?: ReactNode
  onConfirm: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-6">
        <DialogHeader>
          <DialogTitle className="pr-6 text-base font-semibold">{title}</DialogTitle>
        </DialogHeader>
        {children}
        <DialogFooter>
          <Button
            variant={destructive ? "destructive" : "default"}
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            {confirmLabel}
          </Button>
          <Button variant="outline" className="text-primary" onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
