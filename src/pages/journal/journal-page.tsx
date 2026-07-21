import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, ChevronDown, Pencil, Plus } from "lucide-react"
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
import { CommentDialog } from "./comment-dialog"
import {
  useAddJournalWeekMutation,
  useGetJournalQuery,
  useUpdateJournalCellMutation,
  type Journal,
  type JournalWeek,
} from "@/store/services"

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
  day?: Partial<{ attendance: boolean; score: number; comment: string }>
  bonus?: number
  exam?: number
}

function WeekTable({
  week,
  onCellChange,
}: {
  week: JournalWeek
  onCellChange: (studentId: number, patch: CellPatch) => void
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
            {week.dates.map((date) => (
              <th
                key={date}
                colSpan={2}
                className="border-r border-border px-3 py-2 font-semibold"
              >
                <span className="inline-flex items-center gap-2">
                  {date}
                  <Pencil className="size-4 text-primary" />
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
                      onSave={(comment) =>
                        onCellChange(student.student_id, { dayIndex, day: { comment } })
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

export function JournalPage() {
  const { id } = useParams()
  const groupId = Number(id)
  const { data, isLoading } = useGetJournalQuery(groupId)
  const [addWeek] = useAddJournalWeekMutation()
  const [updateCell] = useUpdateJournalCellMutation()

  const [weeks, setWeeks] = useState<JournalWeek[]>([])
  const [openWeeks, setOpenWeeks] = useState<number[]>([])
  const [loadedGroupId, setLoadedGroupId] = useState<number | null>(null)
  const [view, setView] = useState("chart")
  const [sheetUrl, setSheetUrl] = useState("")

  // Seed the editable grid once the journal arrives (adjusting state during render).
  if (data && loadedGroupId !== data.group_id) {
    setLoadedGroupId(data.group_id)
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
        <Button size="lg" onClick={() => addWeek({ groupId, dates: [] })}>
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
              onChange={(e) => setSheetUrl(e.target.value)}
            />
          </div>
          {sheetUrl ? (
            <iframe
              title="Google sheet"
              src={sheetUrl}
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
          <Card key={week.week_number} className="gap-4 p-0">
            <button
              type="button"
              onClick={() => toggleWeek(week.week_number)}
              className="flex items-center gap-2 px-6 pt-6 pb-0 text-left text-2xl font-bold"
            >
              Week {week.week_number}
              <ChevronDown className={cn("size-5 transition-transform", open && "rotate-180")} />
            </button>
            {open && (
              <div className="px-6 pb-6">
                <div className="rounded-xl border border-border">
                  <WeekTable
                    week={week}
                    onCellChange={(studentId, patch) =>
                      handleCellChange(week.week_number, studentId, patch)
                    }
                  />
                </div>
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
