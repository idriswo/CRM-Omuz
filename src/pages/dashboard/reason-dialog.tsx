import { useState } from "react"
import { PencilSimple } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

/** Pencil trigger next to the attendance table's Reason cell. */
export function ReasonDialog({
  studentName,
  reason,
  onSave,
}: {
  studentName: string
  reason: string
  onSave: (reason: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(reason)

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) setDraft(reason)
      }}
    >
      <button
        type="button"
        aria-label={`Edit reason for ${studentName}`}
        onClick={() => setOpen(true)}
        className={cn(
          "shrink-0 text-muted-foreground/60 transition-colors hover:text-primary",
          reason && "text-primary"
        )}
      >
        <PencilSimple weight="duotone" className="size-3.5" />
      </button>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reason</DialogTitle>
          <p className="text-sm text-muted-foreground">{studentName}</p>
        </DialogHeader>
        <Input
          autoFocus
          placeholder="Why was the student absent or late?"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave(draft)
              setOpen(false)
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
