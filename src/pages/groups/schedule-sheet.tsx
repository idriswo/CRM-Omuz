import { useState, type ReactNode } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Toast } from "@/components/shared/toast"
import {
  useAddScheduleSlotMutation,
  useDeleteScheduleSlotMutation,
  useGetGroupScheduleQuery,
  useUpdateScheduleSlotMutation,
  weekdayNames,
  type Weekday,
} from "@/store/services"

const allWeekdays = Object.keys(weekdayNames) as Weekday[]

export function ScheduleSheet({ groupId, children }: { groupId: number; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const { data } = useGetGroupScheduleQuery(groupId, { skip: !open })
  const [addSlot] = useAddScheduleSlotMutation()
  const [updateSlot] = useUpdateScheduleSlotMutation()
  const [deleteSlot] = useDeleteScheduleSlotMutation()

  const [editingId, setEditingId] = useState<number | null>(null)
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
        <SheetContent title="Schedule">
          <Card className="gap-0 p-0">
            {(data?.data ?? []).map((slot) => {
              const editing = editingId === slot.id
              return (
                <div
                  key={slot.id}
                  className="grid grid-cols-[1.5fr_1fr_1fr_auto] items-center gap-3 border-b border-border px-4 py-3 last:border-0"
                >
                  <span className="font-medium">{weekdayNames[slot.weekday]}</span>
                  <Input
                    type="time"
                    className="h-9"
                    defaultValue={slot.start}
                    disabled={!editing}
                    onBlur={(e) =>
                      updateSlot({ groupId, id: slot.id, data: { start: e.target.value } })
                    }
                  />
                  <Input
                    type="time"
                    className="h-9"
                    defaultValue={slot.end}
                    disabled={!editing}
                    onBlur={(e) =>
                      updateSlot({ groupId, id: slot.id, data: { end: e.target.value } })
                    }
                  />
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={editing ? "Done editing" : "Edit lesson"}
                      onClick={() => {
                        setEditingId(editing ? null : slot.id)
                        if (editing) setToast("Schedule is success change!")
                      }}
                    >
                      <Pencil className={cn("size-4", editing ? "text-success" : "text-primary")} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete lesson"
                      onClick={() => deleteSlot({ groupId, id: slot.id })}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </Card>

          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold">New lesson</h3>
            <Card className="gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">Weekdays</Label>
                <div className="flex flex-wrap gap-2">
                  {allWeekdays.map((day) => (
                    <button
                      key={day}
                      type="button"
                      aria-pressed={newDays.includes(day)}
                      onClick={() => toggleDay(day)}
                      className={cn(
                        "h-11 min-w-14 rounded-lg bg-muted text-sm font-semibold transition-colors hover:bg-accent",
                        newDays.includes(day) && "bg-primary text-primary-foreground hover:bg-primary"
                      )}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-end gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-muted-foreground">Start</Label>
                  <Input
                    type="time"
                    className="w-36"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-muted-foreground">End</Label>
                  <Input
                    type="time"
                    className="w-36"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                  />
                </div>
                <Button
                  size="lg"
                  className="ml-auto"
                  disabled={!newDays.length}
                  onClick={handleAdd}
                >
                  ADD <Plus />
                </Button>
              </div>
            </Card>
          </div>
        </SheetContent>
      </Sheet>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  )
}
