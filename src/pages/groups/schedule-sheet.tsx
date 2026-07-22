import { useState, type ReactNode } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Toast } from "@/components/shared/toast"
import {
  useAddScheduleSlotMutation,
  useDeleteScheduleSlotMutation,
  useGetGroupScheduleQuery,
  useUpdateScheduleSlotMutation,
  weekdayNames,
  type ScheduleSlot,
  type Weekday,
} from "@/store/services"

const allWeekdays = Object.keys(weekdayNames) as Weekday[]

/** Outlined time input with the label floating on its border, as in the design. */
function TimeField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="relative">
      <span className="absolute -top-2 left-3 z-10 bg-card px-1 text-xs text-muted-foreground">
        {label}
      </span>
      <Input
        type="time"
        className="w-28"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

export function ScheduleSheet({ groupId, children }: { groupId: number; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const { data } = useGetGroupScheduleQuery(groupId, { skip: !open })
  const [addSlot] = useAddScheduleSlotMutation()
  const [updateSlot] = useUpdateScheduleSlotMutation()
  const [deleteSlot] = useDeleteScheduleSlotMutation()

  const [editing, setEditing] = useState<ScheduleSlot | null>(null)
  const [newDays, setNewDays] = useState<Weekday[]>(["Mn"])
  const [start, setStart] = useState("00:00")
  const [end, setEnd] = useState("00:00")
  const [toast, setToast] = useState<string | null>(null)

  const toggleDay = (day: Weekday) =>
    setNewDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))

  const handleAdd = async () => {
    for (const weekday of newDays) {
      await addSlot({ groupId, data: { weekday, start, end } })
    }
    setToast("Schedule is success change!")
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent title="Schedule" className="max-w-md">
          {/* The lesson list scrolls on its own so "New lesson" stays visible. */}
          <Card className="max-h-[50vh] shrink-0 gap-0 overflow-y-auto p-0">
            {(data?.data ?? []).map((slot) => (
              <div
                key={slot.id}
                className="grid grid-cols-[1.6fr_1fr_1fr_auto] items-center border-b border-border last:border-0"
              >
                <span className="px-3 py-2.5 text-sm font-medium">{weekdayNames[slot.weekday]}</span>
                <span className="border-l border-border px-3 py-2.5 text-sm">{slot.start}</span>
                <span className="border-l border-border px-3 py-2.5 text-sm">{slot.end}</span>
                <div className="flex items-center gap-1.5 border-l border-border px-3 py-2">
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Edit lesson"
                    onClick={() => setEditing(slot)}
                  >
                    <Pencil className="size-4 text-primary" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Delete lesson"
                    onClick={() => deleteSlot({ groupId, id: slot.id })}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </Card>

          <div className="flex shrink-0 flex-col gap-3">
            <h3 className="text-lg font-bold">New lesson</h3>
            <Card className="gap-5">
              <div className="relative rounded-lg border border-input p-3 pt-4">
                <span className="absolute -top-2 left-3 bg-card px-1 text-xs text-muted-foreground">
                  Weekdays
                </span>
                <div className="flex gap-1.5">
                  {allWeekdays.map((day) => (
                    <button
                      key={day}
                      type="button"
                      aria-pressed={newDays.includes(day)}
                      onClick={() => toggleDay(day)}
                      className={cn(
                        "h-9 flex-1 rounded-lg bg-muted text-sm font-semibold transition-colors hover:bg-accent",
                        newDays.includes(day) && "bg-primary text-primary-foreground hover:bg-primary"
                      )}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <TimeField label="Start" value={start} onChange={setStart} />
                <TimeField label="End" value={end} onChange={setEnd} />
                <Button className="ml-auto" disabled={!newDays.length} onClick={handleAdd}>
                  ADD <Plus />
                </Button>
              </div>
            </Card>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-sm gap-5">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit lesson</DialogTitle>
          </DialogHeader>
          {editing && (
            <>
              <div className="relative">
                <span className="absolute -top-2 left-3 z-10 bg-card px-1 text-xs text-muted-foreground">
                  Weekdays
                </span>
                <Select
                  value={editing.weekday}
                  onValueChange={(v) => setEditing({ ...editing, weekday: v as Weekday })}
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {allWeekdays.map((day) => (
                      <SelectItem key={day} value={day}>
                        {weekdayNames[day]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <TimeField
                  label="Start"
                  value={editing.start}
                  onChange={(v) => setEditing({ ...editing, start: v })}
                />
                <TimeField
                  label="End"
                  value={editing.end}
                  onChange={(v) => setEditing({ ...editing, end: v })}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  onClick={async () => {
                    await updateSlot({
                      groupId,
                      id: editing.id,
                      data: { weekday: editing.weekday, start: editing.start, end: editing.end },
                    })
                    setEditing(null)
                    setToast("Schedule is success change!")
                  }}
                >
                  SAVE
                </Button>
                <Button variant="outline" className="text-primary" onClick={() => setEditing(null)}>
                  CANCEL
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  )
}
