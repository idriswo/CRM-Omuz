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
  useGetEmployeesQuery,
  useGetTimetableQuery,
  type TimetableEntry,
} from "@/store/services"
import { colorForCourse, eventColors, type EventColor } from "./event-colors"

type ViewMode = "Day" | "Week" | "Month"

const ROW = 78
const HOURS = Array.from({ length: 13 }, (_, i) => 8 + i) // 08:00 – 20:00
const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

/** `start_time` / `end_time` carry a fixed placeholder date — only the clock
 * matters, and it is stored as sent, so read the UTC parts rather than letting
 * the browser shift them into the local zone. */
function clock(iso: string) {
  const date = new Date(iso)
  return {
    hour: date.getUTCHours(),
    text: `${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")}`,
  }
}

function dayKey(iso: string | Date) {
  const date = typeof iso === "string" ? new Date(iso) : iso
  return `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`
}

function toISODate(date: Date) {
  return date.toISOString().slice(0, 10)
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

/** Matches the backend, which uses date-fns `startOfWeek` (Sunday-based). */
function startOfWeek(date: Date) {
  return addDays(date, -date.getUTCDay())
}

interface LessonEvent {
  key: string
  id: number
  title: string
  type: string
  start: string
  end: string
  startHour: number
  room: string
  mentor: string
  color: EventColor
  date: Date
}

export function TimetablePage() {
  const [view, setView] = useState<ViewMode>("Day")
  const [anchor, setAnchor] = useState(() => new Date(toISODate(new Date())))

  const { data: entries, isLoading, isError } = useGetTimetableQuery({
    view: view.toLowerCase() as "day" | "week" | "month",
    date: toISODate(anchor),
  })
  const { data: employees } = useGetEmployeesQuery({ limit: 200 })

  const mentorNames = useMemo(
    () => new Map((employees?.data ?? []).map((e) => [e.id, e.fullName])),
    [employees]
  )

  const events: LessonEvent[] = useMemo(
    () =>
      (entries ?? []).map((entry: TimetableEntry, index) => {
        const start = clock(entry.start_time)
        const end = clock(entry.end_time)
        return {
          key: `${entry.id}-${entry.date}-${index}`,
          id: entry.id,
          title: entry.course_name,
          type: entry.type,
          start: start.text,
          end: end.text,
          startHour: start.hour,
          room: entry.class_room,
          mentor: mentorNames.get(entry.mentor_id) ?? `Mentor #${entry.mentor_id}`,
          color: colorForCourse(entry.course_name),
          date: new Date(entry.date),
        }
      }),
    [entries, mentorNames]
  )

  const byDay = useMemo(() => {
    const map = new Map<string, LessonEvent[]>()
    for (const event of events) {
      const key = dayKey(event.date)
      const list = map.get(key) ?? []
      list.push(event)
      map.set(key, list)
    }
    for (const list of map.values()) list.sort((a, b) => a.start.localeCompare(b.start))
    return map
  }, [events])

  const step = (direction: 1 | -1) => {
    setAnchor((current) => {
      if (view === "Day") return addDays(current, direction)
      if (view === "Week") return addDays(current, 7 * direction)
      const next = new Date(current)
      next.setUTCMonth(next.getUTCMonth() + direction, 1)
      return next
    })
  }

  const weekStart = startOfWeek(anchor)
  const label =
    view === "Day"
      ? anchor.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short", timeZone: "UTC" })
      : view === "Week"
        ? `${weekStart.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })} – ${addDays(weekStart, 6).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })}`
        : anchor.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Timetable</h1>
        <ViewSwitch view={view} onChange={setView} />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => step(-1)}
          className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
          aria-label="Previous"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="rounded-lg bg-card px-4 py-1.5 text-sm font-semibold shadow-xs">
          {label}
        </span>
        <button
          onClick={() => step(1)}
          className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
          aria-label="Next"
        >
          <ChevronRight className="size-4" />
        </button>
        <button
          onClick={() => setAnchor(new Date(toISODate(new Date())))}
          className="rounded-lg border border-input px-3 py-1.5 text-sm font-medium hover:bg-accent"
        >
          Today
        </button>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading timetable…</p>}
      {isError && <p className="text-sm text-destructive">Could not load the timetable.</p>}
      {!isLoading && !isError && events.length === 0 && (
        <p className="text-sm text-muted-foreground">No lessons scheduled in this period.</p>
      )}

      {view === "Month" ? (
        <MonthView anchor={anchor} byDay={byDay} />
      ) : (
        <TimeGrid
          days={view === "Week" ? Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)) : [anchor]}
          byDay={byDay}
          withDayHeader={view === "Week"}
        />
      )}
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

function TimeGrid({
  days,
  byDay,
  withDayHeader,
}: {
  days: Date[]
  byDay: Map<string, LessonEvent[]>
  withDayHeader: boolean
}) {
  const minWidth = withDayHeader ? 1400 : 900

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <div style={{ minWidth }}>
          {withDayHeader && (
            <div className="flex border-b border-border">
              <div className="w-20 shrink-0" />
              {days.map((day) => (
                <div
                  key={day.toISOString()}
                  className="flex-1 border-r border-border px-4 py-3 text-center text-sm font-semibold text-muted-foreground last:border-r-0"
                >
                  {WEEKDAY_LABELS[day.getUTCDay()]}{" "}
                  {day.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", timeZone: "UTC" })}
                </div>
              ))}
            </div>
          )}

          <div className="relative flex" style={{ height: HOURS.length * ROW }}>
            {/* Hour labels + lines */}
            <div className="w-20 shrink-0">
              {HOURS.map((hour, i) => (
                <div
                  key={hour}
                  className="absolute left-0 pl-6 text-sm text-muted-foreground"
                  style={{ top: i * ROW - 8 }}
                >
                  {String(hour).padStart(2, "0")}:00
                </div>
              ))}
            </div>
            {HOURS.map((hour, i) => (
              <div
                key={`line-${hour}`}
                className="absolute right-0 left-20 border-t border-dashed border-border"
                style={{ top: i * ROW }}
              />
            ))}

            {days.map((day) => {
              const dayList = byDay.get(dayKey(day)) ?? []
              const byHour = new Map<number, LessonEvent[]>()
              for (const event of dayList) {
                const list = byHour.get(event.startHour) ?? []
                list.push(event)
                byHour.set(event.startHour, list)
              }

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "relative flex-1",
                    withDayHeader && "border-r border-border last:border-r-0"
                  )}
                >
                  {[...byHour.entries()].map(([hour, list]) => (
                    <div
                      key={hour}
                      className={cn(
                        "absolute inset-x-2 flex gap-3",
                        withDayHeader ? "flex-col" : "flex-row flex-wrap"
                      )}
                      style={{ top: Math.max(0, hour - HOURS[0]) * ROW + 8 }}
                    >
                      {list.map((event) => (
                        <EventBlock key={event.key} event={event} full={withDayHeader} />
                      ))}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}

function EventBlock({ event, full }: { event: LessonEvent; full?: boolean }) {
  const c = eventColors[event.color]
  return (
    <div
      className={cn(
        "shrink-0 rounded-lg border border-l-4 p-3",
        full ? "w-full" : "w-[190px]",
        c.border,
        c.bg
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-sm font-semibold">{event.title}</p>
        <span
          className={cn(
            "shrink-0 rounded-md border bg-card px-1.5 py-0.5 text-[10px] font-medium",
            c.chip
          )}
        >
          {event.type}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {event.start} - {event.end}
      </p>
      <div className="mt-4 flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="truncate">{event.room}</span>
        <span className="truncate">{event.mentor}</span>
      </div>
    </div>
  )
}

function MonthView({ anchor, byDay }: { anchor: Date; byDay: Map<string, LessonEvent[]> }) {
  const [openDay, setOpenDay] = useState<Date | null>(null)

  const cells = useMemo(() => {
    const first = new Date(Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth(), 1))
    const gridStart = addDays(first, -first.getUTCDay())
    return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))
  }, [anchor])

  const todayKey = dayKey(new Date(toISODate(new Date())))

  return (
    <>
      <Card className="overflow-hidden p-0">
        <div className="grid grid-cols-7">
          {WEEKDAY_LABELS.map((l) => (
            <div
              key={l}
              className="border-r border-b border-border bg-secondary/50 px-4 py-3 text-sm font-medium text-muted-foreground last:border-r-0"
            >
              {l}
            </div>
          ))}

          {cells.map((cell) => {
            const list = byDay.get(dayKey(cell)) ?? []
            const muted = cell.getUTCMonth() !== anchor.getUTCMonth()
            const visible = list.slice(0, 2)
            const extra = list.length - visible.length

            return (
              <div
                key={cell.toISOString()}
                className="min-h-[128px] border-r border-b border-border p-2 [&:nth-child(7n)]:border-r-0"
              >
                <div className="flex justify-end">
                  <span
                    className={cn(
                      "flex size-7 items-center justify-center rounded-full text-sm",
                      muted && "text-muted-foreground/40",
                      dayKey(cell) === todayKey && "bg-primary font-semibold text-primary-foreground"
                    )}
                  >
                    {cell.getUTCDate()}
                  </span>
                </div>

                {visible.length > 0 && (
                  <div className="mt-1 flex flex-col gap-1">
                    {visible.map((event) => (
                      <div
                        key={event.key}
                        className={cn(
                          "truncate rounded-md border bg-card px-2 py-1 text-xs",
                          eventColors[event.color].chip
                        )}
                      >
                        {event.start} | {event.title}
                      </div>
                    ))}
                    {extra > 0 && (
                      <button
                        onClick={() => setOpenDay(cell)}
                        className="mt-0.5 text-left text-xs font-medium text-primary hover:underline"
                      >
                        +{extra} more
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      <Dialog open={openDay !== null} onOpenChange={(o) => !o && setOpenDay(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {openDay?.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              })}
            </DialogTitle>
          </DialogHeader>
          <div className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto pr-1">
            {(openDay ? (byDay.get(dayKey(openDay)) ?? []) : []).map((event) => (
              <div
                key={event.key}
                className={cn(
                  "rounded-md border bg-card px-3 py-2 text-sm",
                  eventColors[event.color].chip
                )}
              >
                {event.start} | {event.title}
                <span className="ml-2 text-xs text-muted-foreground">
                  {event.room} · {event.mentor}
                </span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
