import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, ChevronDown, Pencil, Plus, Trash2 } from "lucide-react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CommentDialog } from "./comment-dialog"
import { NewWeekDialog } from "./new-week-dialog"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import {
  useAddJournalDateMutation,
  useUpdateJournalDateMutation,
  useDeleteJournalDateMutation,
  useDeleteJournalWeekMutation,
  useAddJournalWeekMutation,
  useGetJournalQuery,
  useUpdateJournalCellMutation,
  useSetJournalSheetMutation,
  type Journal,
  type JournalWeek,
} from "@/store/services"
import { usePersistedState } from "@/hooks/use-persisted-state"

const lineColors = [
  "#fa8c16",
  "#22c55e",
  "#4c3ce8",
  "#a855f7",
  "#22b8cf",
  "#64748b",
  "#f5c518",
  "#f5222d",
]

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover p-3 text-sm shadow-md">
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name} - {p.value}
        </p>
      ))}
    </div>
  )
}

/** The trailing "Avarage" column is highlighted, the week labels stay muted. */
function WeekTick({
  x,
  y,
  payload,
}: {
  x?: number
  y?: number
  payload?: { value: string }
}) {
  const isAverage = payload?.value === "Avarage"
  return (
    <text
      x={x}
      y={(y ?? 0) + 14}
      textAnchor="middle"
      fontSize={12}
      fill={isAverage ? "var(--color-primary)" : "var(--color-muted-foreground)"}
      fontWeight={isAverage ? 600 : 400}
    >
      {payload?.value}
    </text>
  )
}

interface CellPatch {
  dayIndex?: number
  day?: Partial<{ attendance: boolean; score: number; comment: string; late: number }>
  bonus?: number
  exam?: number
}

function WeekTable({
  week,
  onCellChange,
  onEditDate,
  onDeleteDate,
}: {
  week: JournalWeek
  onCellChange: (studentId: number, patch: CellPatch) => void
  onEditDate: (index: number, date: string) => void
  onDeleteDate: (index: number, date: string) => void
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border">
            <th
              rowSpan={2}
              className="min-w-48 border-r border-border px-4 text-left align-middle font-semibold"
            >
              Students
            </th>
            {week.dates.map((date, dateIndex) => (
              <th
                key={`${date}-${dateIndex}`}
                colSpan={2}
                className="border-r border-border px-3 py-2 font-semibold"
              >
                <span className="inline-flex items-center gap-2">
                  {date}
                  <button
                    type="button"
                    aria-label={`Edit date ${date}`}
                    onClick={() => onEditDate(dateIndex, date)}
                  >
                    <Pencil className="size-4 text-primary" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete date ${date}`}
                    onClick={() => onDeleteDate(dateIndex, date)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </button>
                </span>
              </th>
            ))}
            <th colSpan={4} className="px-3 py-2 font-semibold">
              End of week
            </th>
          </tr>
          <tr className="border-b border-border text-muted-foreground">
            {week.dates.map((date) => [
              <th key={`${date}-att`} className="px-3 py-2 font-medium">
                <span className="inline-flex items-center gap-2">
                  <Checkbox aria-label={`Mark all present on ${date}`} />
                  Att
                </span>
              </th>,
              <th key={`${date}-score`} className="border-r border-border px-3 py-2 font-medium">
                Score
              </th>,
            ])}
            <th className="px-3 py-2 font-medium">
              <span className="inline-flex items-center gap-2">
                <Checkbox aria-label="Mark all present" />
                Att
              </span>
            </th>
            <th className="px-3 py-2 font-medium">Bonus</th>
            <th className="px-3 py-2 font-medium">Exam</th>
            <th className="px-3 py-2 font-medium">Sum</th>
          </tr>
        </thead>
        <tbody>
          {week.students.map((student, index) => (
            <tr key={student.student_id} className="border-b border-border last:border-0">
              <td className="border-r border-border px-4 py-2.5 whitespace-nowrap">
                {index + 1}. {student.full_name}
              </td>
              {student.days.map((day, dayIndex) => [
                <td key={`${day.date}-att`} className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <CommentDialog
                      studentName={student.full_name}
                      date={day.date}
                      comment={day.comment}
                      late={day.late ?? 0}
                      onSave={(value) =>
                        onCellChange(student.student_id, { dayIndex, day: value })
                      }
                    />
                    <Checkbox
                      checked={day.attendance}
                      aria-label={`Attendance for ${student.full_name} on ${day.date}`}
                      onCheckedChange={(checked) =>
                        onCellChange(student.student_id, {
                          dayIndex,
                          day: { attendance: checked === true },
                        })
                      }
                    />
                  </div>
                </td>,
                <td key={`${day.date}-score`} className="border-r border-border px-3 py-2.5">
                  <Select
                    value={String(day.score ?? "")}
                    onValueChange={(value) =>
                      onCellChange(student.student_id, {
                        dayIndex,
                        day: { score: Number(value) },
                      })
                    }
                  >
                    <SelectTrigger className="h-9 w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((score) => (
                        <SelectItem key={score} value={String(score)}>
                          {score}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>,
              ])}
              <td className="px-3 py-2.5">
                <Checkbox aria-label="End of week attendance" />
              </td>
              <td className="px-3 py-2.5">
                <Input
                  className="h-9 w-16 text-center"
                  value={student.bonus}
                  onChange={(e) =>
                    onCellChange(student.student_id, { bonus: Number(e.target.value) || 0 })
                  }
                />
              </td>
              <td className="px-3 py-2.5">
                <Input
                  className="h-9 w-16 text-center"
                  value={student.exam}
                  onChange={(e) =>
                    onCellChange(student.student_id, { exam: Number(e.target.value) || 0 })
                  }
                />
              </td>
              <td className="px-3 py-2.5">
                <span className="inline-flex min-w-11 justify-center rounded-full bg-amber-400 px-3 py-1 font-semibold text-amber-950">
                  {student.sum}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Google refuses to render an /edit link inside an iframe; /preview embeds fine. */
function toEmbedUrl(url: string) {
  const id = url.match(/\/spreadsheets\/d\/([\w-]+)/)?.[1]
  if (!id) return url
  const gid = url.match(/[#&?]gid=(\d+)/)?.[1]
  return `https://docs.google.com/spreadsheets/d/${id}/preview${gid ? `?gid=${gid}` : ""}`
}

export function JournalPage() {
  const { id } = useParams()
  const groupId = Number(id)
  const { data, isLoading } = useGetJournalQuery(groupId)
  const [addWeek] = useAddJournalWeekMutation()
  const [addDate] = useAddJournalDateMutation()
  const [updateDate] = useUpdateJournalDateMutation()
  /** Open date dialog: `index` is null when adding, set when editing. */
  const [dateForm, setDateForm] = useState<{
    week: number
    index: number | null
    current: string
  } | null>(null)
  const [newDate, setNewDate] = useState("")
  const [newWeekOpen, setNewWeekOpen] = useState(false)
  const [deleteDate] = useDeleteJournalDateMutation()
  const [deleteWeek] = useDeleteJournalWeekMutation()
  const [pendingDate, setPendingDate] = useState<{
    week: number
    index: number
    date: string
  } | null>(null)
  const [pendingWeek, setPendingWeek] = useState<number | null>(null)
  const [updateCell] = useUpdateJournalCellMutation()

  const [weeks, setWeeks] = useState<JournalWeek[]>([])
  const [openWeeks, setOpenWeeks] = useState<number[]>([])
  const [loadedKey, setLoadedKey] = useState("")
  const [view, setView] = usePersistedState("journal:view", "chart")
  const [setSheet] = useSetJournalSheetMutation()
  const [sheetUrl, setSheetUrl] = useState("")
  const [loadedSheetFor, setLoadedSheetFor] = useState<number | null>(null)

  // The link lives on the group, so it survives a reload and other staff see it too.
  if (data && loadedSheetFor !== data.group_id) {
    setLoadedSheetFor(data.group_id)
    setSheetUrl(data.sheet_url ?? "")
  }

  const saveSheetUrl = (url: string) => {
    setSheetUrl(url)
    if (!url || /\/spreadsheets\/d\/[\w-]+/.test(url)) setSheet({ groupId, sheet_url: url })
  }

  // Seed the editable grid when the journal arrives or gains a week / date
  // (adjusting state during render).
  const journalKey = data
    ? `${data.group_id}:${data.weeks.length}:${data.weeks.map((w) => w.dates.length).join("-")}`
    : ""
  if (data && loadedKey !== journalKey) {
    setLoadedKey(journalKey)
    setWeeks(data.weeks)
    setOpenWeeks(data.weeks.slice(0, 2).map((w) => w.week_number))
  }

  const toggleWeek = (weekNumber: number) =>
    setOpenWeeks((prev) =>
      prev.includes(weekNumber) ? prev.filter((w) => w !== weekNumber) : [...prev, weekNumber]
    )

  const handleCellChange = (weekNumber: number, studentId: number, patch: CellPatch) => {
    setWeeks((prev) =>
      prev.map((week) =>
        week.week_number !== weekNumber
          ? week
          : {
              ...week,
              students: week.students.map((student) => {
                if (student.student_id !== studentId) return student
                const next = { ...student }
                if (patch.day && patch.dayIndex !== undefined) {
                  next.days = student.days.map((day, i) =>
                    i === patch.dayIndex ? { ...day, ...patch.day } : day
                  )
                }
                if (patch.bonus !== undefined) next.bonus = patch.bonus
                if (patch.exam !== undefined) next.exam = patch.exam
                return next
              }),
            }
      )
    )

    const week = weeks.find((w) => w.week_number === weekNumber)
    const dayDate = patch.dayIndex !== undefined ? week?.dates[patch.dayIndex] : week?.dates[0]
    updateCell({
      groupId,
      weekId: weekNumber,
      studentId,
      data: { day_date: dayDate ?? "", ...patch.day, bonus: patch.bonus, exam: patch.exam },
    })
  }

  if (isLoading || !data) {
    return <p className="text-muted-foreground">Loading...</p>
  }

  const series = (data as Journal).students

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/groups/${groupId}`} aria-label="Back to group">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Journal</h1>
          <span className="text-lg text-muted-foreground">{data.group_name}</span>
        </div>
        <Tabs value={view} onValueChange={setView}>
          <TabsList>
            <TabsTrigger value="chart">Exam graphics</TabsTrigger>
            <TabsTrigger value="sheets">Google sheets</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button size="lg" onClick={() => setNewWeekOpen(true)}>
          <Plus /> New week
        </Button>
      </div>

      {view === "sheets" ? (
        <Card className="gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Google sheets</h2>
            <Input
              className="w-full max-w-md"
              placeholder="Paste a Google Sheets share link"
              value={sheetUrl}
              onChange={(e) => saveSheetUrl(e.target.value)}
            />
          </div>
          {sheetUrl ? (
            <iframe
              title="Google sheet"
              src={toEmbedUrl(sheetUrl)}
              className="h-[520px] w-full rounded-xl border border-border"
            />
          ) : (
            <div className="flex h-[320px] items-center justify-center rounded-xl border-2 border-dashed border-border text-center text-muted-foreground">
              Paste a published Google Sheets link above to embed it here.
            </div>
          )}
        </Card>
      ) : (
      <Card>
        <h2 className="text-center text-2xl font-bold">Exam graphics</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.chart} margin={{ top: 8, right: 16, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="4 4" />
              <XAxis dataKey="week" tickLine={false} axisLine={false} tick={<WeekTick />} />
              <YAxis
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
              />
              <Tooltip content={<ChartTooltip />} />
              {series.map((student, i) => (
                <Line
                  key={student.id}
                  type="monotone"
                  dataKey={student.name}
                  stroke={lineColors[i % lineColors.length]}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {series.map((student, i) => (
            <div key={student.id} className="flex items-center gap-2 text-sm font-medium">
              <span
                className="size-2.5 rounded-full"
                style={{ background: lineColors[i % lineColors.length] }}
              />
              {student.name}
            </div>
          ))}
        </div>
      </Card>
      )}

      {weeks.map((week) => {
        const open = openWeeks.includes(week.week_number)
        return (
          <Card key={week.week_number} className="gap-0 p-0">
            <div className="flex items-center justify-between gap-3 px-6 py-5">
              <button
                type="button"
                onClick={() => toggleWeek(week.week_number)}
                className="flex items-center gap-2 text-left text-2xl font-bold"
              >
                Week {week.week_number}
                <ChevronDown className={cn("size-5 transition-transform", open && "rotate-180")} />
              </button>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="text-primary"
                  onClick={() => {
                    setNewDate("")
                    setDateForm({ week: week.week_number, index: null, current: "" })
                  }}
                >
                  <Plus /> New date
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={`Delete week ${week.week_number}`}
                  onClick={() => setPendingWeek(week.week_number)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
            {open && (
              <div className="px-6 pb-6">
                <div className="rounded-xl border border-border">
                  <WeekTable
                    week={week}
                    onCellChange={(studentId, patch) =>
                      handleCellChange(week.week_number, studentId, patch)
                    }
                    onEditDate={(index, date) => {
                      setNewDate("")
                      setDateForm({ week: week.week_number, index, current: date })
                    }}
                    onDeleteDate={(index, date) =>
                      setPendingDate({ week: week.week_number, index, date })
                    }
                  />
                </div>
              </div>
            )}
          </Card>
        )
      })}

      <ConfirmDialog
        open={pendingDate !== null}
        onOpenChange={(o) => !o && setPendingDate(null)}
        title={`Do you really want to delete ${pendingDate?.date ?? ""}?`}
        onConfirm={() => {
          if (pendingDate) {
            deleteDate({ groupId, weekId: pendingDate.week, index: pendingDate.index })
          }
        }}
      />

      <ConfirmDialog
        open={pendingWeek !== null}
        onOpenChange={(o) => !o && setPendingWeek(null)}
        title={`Do you really want to delete week ${pendingWeek ?? ""}?`}
        onConfirm={() => {
          if (pendingWeek !== null) deleteWeek({ groupId, weekId: pendingWeek })
        }}
      />

      <NewWeekDialog
        open={newWeekOpen}
        onOpenChange={setNewWeekOpen}
        suggestedNumber={Math.max(0, ...weeks.map((w) => w.week_number)) + 1}
        onCreate={({ week_number, dates }) => addWeek({ groupId, dates, week_number })}
      />

      <Dialog open={dateForm !== null} onOpenChange={(o) => !o && setDateForm(null)}>
        <DialogContent className="max-w-sm gap-5">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {dateForm?.index === null ? "New date" : "Edit date"}
            </DialogTitle>
          </DialogHeader>
          <div className="relative">
            <span className="absolute -top-2 left-3 z-10 bg-card px-1 text-xs text-muted-foreground">
              Date
            </span>
            <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
          </div>
          <DialogFooter>
            <Button
              disabled={!newDate}
              onClick={async () => {
                if (dateForm) {
                  if (dateForm.index === null) {
                    await addDate({ groupId, weekId: dateForm.week, date: newDate })
                  } else {
                    await updateDate({
                      groupId,
                      weekId: dateForm.week,
                      index: dateForm.index,
                      date: newDate,
                    })
                  }
                }
                setDateForm(null)
              }}
            >
              {dateForm?.index === null ? "ADD" : "SAVE"}
            </Button>
            <Button variant="outline" className="text-primary" onClick={() => setDateForm(null)}>
              CANCEL
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
