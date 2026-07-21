import { useState } from "react"
import { MessageSquare } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

/** Per-day note attached to a student's attendance cell. */
export function CommentDialog({
  studentName,
  date,
  comment,
  onSave,
}: {
  studentName: string
  date: string
  comment: string
  onSave: (comment: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(comment)

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) setDraft(comment)
      }}
    >
      <DialogTrigger
        aria-label={`Comment for ${studentName} on ${date}`}
        className={cn(
          "text-muted-foreground/60 transition-colors hover:text-primary",
          comment && "text-primary"
        )}
      >
        <MessageSquare className="size-4" />
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Comment</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {studentName} — {date}
          </p>
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
