import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

/** Outlined field with the label floating on its border. */
function Field({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <span className="absolute -top-2 left-3 z-10 bg-card px-1 text-xs text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  )
}

/** Journal dates are shown as dd.mm.yy. */
function formatDate(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${String(date.getFullYear()).slice(-2)}`
}

/** Every day from `start` to `end`, inclusive. */
function datesBetween(start: string, end: string) {
  const from = new Date(start)
  const to = new Date(end)
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from > to) return []
  const dates: string[] = []
  for (const day = new Date(from); day <= to; day.setDate(day.getDate() + 1)) {
    dates.push(formatDate(day))
  }
  return dates
}

export function NewWeekDialog({
  open,
  onOpenChange,
  suggestedNumber,
  onCreate,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Next free week number, pre-filled in the form. */
  suggestedNumber: number
  onCreate: (week: { week_number: number; dates: string[] }) => void
}) {
  const [number, setNumber] = useState(String(suggestedNumber))
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [loadedFor, setLoadedFor] = useState<number | null>(null)

  // Refresh the suggested number each time the dialog opens.
  if (open && loadedFor !== suggestedNumber) {
    setLoadedFor(suggestedNumber)
    setNumber(String(suggestedNumber))
  }

  const dates = datesBetween(start, end)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-5">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">New week</DialogTitle>
        </DialogHeader>

        <Field label="Week number">
          <Input
            type="number"
            min={1}
            value={number}
            onFocus={(e) => e.target.select()}
            onChange={(e) => setNumber(e.target.value.replace(/^0+(?=\d)/, ""))}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Start">
            <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </Field>
          <Field label="End">
            <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          </Field>
        </div>

        {dates.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {dates.length} days: {dates.join(", ")}
          </p>
        )}

        <DialogFooter>
          <Button
            disabled={!number || !dates.length}
            onClick={() => {
              onCreate({ week_number: Number(number), dates })
              setStart("")
              setEnd("")
              onOpenChange(false)
            }}
          >
            ADD
          </Button>
          <Button variant="outline" className="text-primary" onClick={() => onOpenChange(false)}>
            CANCEL
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
