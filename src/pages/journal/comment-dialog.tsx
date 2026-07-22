import { useState } from "react"

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
import { Textarea } from "@/components/ui/textarea"

/**
 * Speech bubble that turns solid once a note exists — an outlined bubble reads
 * as "empty", the filled one as "has a comment".
 */
function CommentIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        d="M4.5 4h15a1.5 1.5 0 0 1 1.5 1.5v10A1.5 1.5 0 0 1 19.5 17H9l-4.5 4V5.5A1.5 1.5 0 0 1 4.5 4Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8 8.75h9M8 12.25h6"
        stroke={filled ? "var(--color-primary-foreground)" : "currentColor"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Per-day note attached to a student's attendance cell: minutes late plus a reason. */
export function CommentDialog({
  studentName,
  date,
  comment,
  late,
  onSave,
}: {
  studentName: string
  date: string
  comment: string
  /** Minutes the student was late. */
  late: number
  onSave: (value: { comment: string; late: number }) => void
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(comment)
  // Kept as text so typing over the leading "0" does not leave "02".
  const [draftLate, setDraftLate] = useState(String(late))

  const filled = Boolean(comment) || late > 0

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) {
          setDraft(comment)
          setDraftLate(String(late))
        }
      }}
    >
      <DialogTrigger
        aria-label={`Comment for ${studentName} on ${date}`}
        className={cn(
          "text-muted-foreground/60 transition-colors hover:text-primary",
          filled && "text-primary"
        )}
      >
        <CommentIcon filled={filled} />
      </DialogTrigger>
      <DialogContent className="max-w-md gap-5">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Comment</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {studentName} — {date}
          </p>
        </DialogHeader>

        <div className="relative">
          <span className="absolute -top-2 left-3 z-10 bg-card px-1 text-xs text-muted-foreground">
            Late
          </span>
          <Input
            type="number"
            min={0}
            value={draftLate}
            onFocus={(e) => e.target.select()}
            onChange={(e) => setDraftLate(e.target.value.replace(/^0+(?=\d)/, ""))}
            onBlur={() => setDraftLate((v) => (v === "" ? "0" : v))}
          />
        </div>

        <Textarea
          placeholder="Reason"
          rows={3}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />

        <DialogFooter>
          <Button
            onClick={() => {
              onSave({ comment: draft, late: Number(draftLate) || 0 })
              setOpen(false)
            }}
          >
            SAVE
          </Button>
          <Button variant="outline" className="text-primary" onClick={() => setOpen(false)}>
            CANCEL
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
