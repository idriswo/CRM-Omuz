import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  dayEvents,
  eventColors,
  hours,
  monthCells,
  monthChipEvents,
  monthExtraCount,
  monthWeekdayLabels,
  weekDays,
  type TimetableEvent,
} from "./mock-data"
import { usePersistedState } from "@/hooks/use-persisted-state"

type ViewMode = "Day" | "Week" | "Month"
const ROW = 78

export function TimetablePage() {
  const [view, setView] = usePersistedState<ViewMode>("timetable:view", "Day")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Timetable</h1>
        <ViewSwitch view={view} onChange={setView} />
      </div>

      <DateNav view={view} />

      {view === "Month" ? <MonthView /> : <TimeGrid withDayHeader={view === "Week"} />}
    </div>
  )
}

function ViewSwitch({ view, onChange }: { view: ViewMode; onChange: (v: ViewMode) => void }) {
  return (
    <div className="flex items-center rounded-xl bg-secondary p-1">
      {(["Day", "Week", "Month"] as const).map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={cn(
            "rounded-lg px-6 py-2 text-sm font-semibold transition-colors",
            view === v ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
          )}
        >
          {v}
        </button>
      ))}
    </div>
  )
}

function DateNav({ view }: { view: ViewMode }) {
  const label =
    view === "Day" ? "Monday / 19 Feb" : view === "Week" ? "Mon / 19 Feb - Sat / 24 Feb" : "February 2023"
  return (
    <div className="flex items-center gap-3">
      <button className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <ChevronLeft className="size-4" />
      </button>
      <span className="rounded-lg bg-card px-4 py-1.5 text-sm font-semibold shadow-xs">{label}</span>
      <button className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <ChevronRight className="size-4" />
      </button>
    </div>
  )
}

function TimeGrid({ withDayHeader }: { withDayHeader: boolean }) {
  const groups = useMemo(() => {
    const map = new Map<number, TimetableEvent[]>()
    for (const ev of dayEvents) {
      const arr = map.get(ev.startHour) ?? []
      arr.push(ev)
      map.set(ev.startHour, arr)
    }
    return map
  }, [])

  return (
    <Card className="overflow-hidden p-0">
      {withDayHeader && (
        <div className="grid min-w-[1560px] grid-cols-7 border-b border-border">
          {weekDays.map((d) => (
            <div
              key={d.label}
              className="border-r border-border px-4 py-3 text-center text-sm font-semibold text-muted-foreground last:border-r-0"
            >
              {d.label}
            </div>
          ))}
        </div>
      )}

      <div className="overflow-x-auto">
        <div className="relative min-w-[1560px]" style={{ height: hours.length * ROW }}>
          {/* Hour lines + labels */}
          {hours.map((h, i) => (
            <div key={h} className="absolute inset-x-0 flex items-center" style={{ top: i * ROW }}>
              <span className="w-20 shrink-0 pl-6 text-sm text-muted-foreground">
                {String(h).padStart(2, "0")}:00
              </span>
              <div className="h-px flex-1 border-t border-dashed border-border" />
            </div>
          ))}

          {/* Event strips */}
          {[...groups.entries()].map(([hour, evs]) => (
            <div
              key={hour}
              className="absolute right-0 flex gap-3 pr-4"
              style={{ top: (hour - 8) * ROW + 8, left: 80 }}
            >
              {evs.map((ev) => (
                <EventBlock key={ev.id} ev={ev} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function EventBlock({ ev }: { ev: TimetableEvent }) {
  const c = eventColors[ev.color]
  return (
    <div className={cn("w-[180px] shrink-0 rounded-lg border border-l-4 p-3", c.border, c.bg)}>
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-sm font-semibold">{ev.title}</p>
        <span className={cn("shrink-0 rounded-md border bg-card px-1.5 py-0.5 text-[10px] font-medium", c.chip)}>
          {ev.type}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {ev.start} - {ev.end}
      </p>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span className="truncate">{ev.room}</span>
        <span className="truncate">{ev.mentor}</span>
      </div>
    </div>
  )
}

function MonthView() {
  const [openDay, setOpenDay] = useState<number | null>(null)

  return (
    <>
      <Card className="overflow-hidden p-0">
        <div className="grid grid-cols-7">
          {monthWeekdayLabels.map((l) => (
            <div
              key={l}
              className="border-b border-r border-border bg-secondary/50 px-4 py-3 text-sm font-medium text-muted-foreground last:border-r-0"
            >
              {l}
            </div>
          ))}

          {monthCells.map((cell, i) => (
            <div
              key={i}
              className="min-h-[128px] border-b border-r border-border p-2 last-of-type:border-r-0 [&:nth-child(7n)]:border-r-0"
            >
              <div className="flex justify-end">
                <span
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full text-sm",
                    cell.muted && "text-muted-foreground/40",
                    cell.today && "bg-primary font-semibold text-primary-foreground"
                  )}
                >
                  {cell.day}
                </span>
              </div>

              {cell.hasEvents && (
                <div className="mt-1 flex flex-col gap-1">
                  {monthChipEvents.map((chip, j) => (
                    <div
                      key={j}
                      className={cn(
                        "rounded-md border bg-card px-2 py-1 text-xs",
                        eventColors[chip.color].chip
                      )}
                    >
                      {chip.time} | {chip.title}
                    </div>
                  ))}
                  <button
                    onClick={() => setOpenDay(cell.day)}
                    className="mt-0.5 text-left text-xs font-medium text-primary hover:underline"
                  >
                    +{monthExtraCount} more
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Dialog open={openDay !== null} onOpenChange={(o) => !o && setOpenDay(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{openDay} February 2023</DialogTitle>
          </DialogHeader>
          <div className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto pr-1">
            {dayEvents.map((ev) => (
              <div
                key={ev.id}
                className={cn(
                  "rounded-md border bg-card px-3 py-2 text-sm",
                  eventColors[ev.color].chip
                )}
              >
                {ev.start} | {ev.title}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
