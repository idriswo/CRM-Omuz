import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  BookUser,
  CalendarCheck,
  ChevronRight,
  Minus,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Trophy,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar } from "@/components/shared/avatar"
import { ALL, FilterSelect } from "@/components/shared/filter-select"
import { SearchInput } from "@/components/shared/search-input"
import { StatCard } from "@/components/shared/stat-card"
import { courses, groups, progressRows } from "./mock-data"

function scoreColor(score: number) {
  if (score >= 80) return "var(--color-success)"
  if (score >= 50) return "#f59e0b"
  return "var(--color-destructive)"
}

function ScoreBar({ value }: { value: number }) {
  const color = scoreColor(value)
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-2 w-28 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-[width]"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="w-9 text-sm font-semibold" style={{ color }}>
        {value}%
      </span>
    </div>
  )
}

function TrendIcon({ trend }: { trend: "up" | "down" | "flat" }) {
  if (trend === "up") return <TrendingUp className="size-4 text-success" />
  if (trend === "down") return <TrendingDown className="size-4 text-destructive" />
  return <Minus className="size-4 text-muted-foreground" />
}

export function ProgressbookPage() {
  const [search, setSearch] = useState("")
  const [group, setGroup] = useState(ALL)
  const [course, setCourse] = useState(ALL)

  const filtered = useMemo(
    () =>
      progressRows.filter(
        (r) =>
          r.fullName.toLowerCase().includes(search.toLowerCase()) &&
          (group === ALL || r.group === group) &&
          (course === ALL || r.course === course)
      ),
    [search, group, course]
  )

  const avgScore = Math.round(
    progressRows.reduce((sum, r) => sum + r.averageScore, 0) / progressRows.length
  )
  const avgAttendance = Math.round(
    progressRows.reduce((sum, r) => sum + r.attendance, 0) / progressRows.length
  )
  const topStudent = [...progressRows].sort((a, b) => b.averageScore - a.averageScore)[0]

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Progressbook</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard value={progressRows.length} label="Students" color="var(--color-primary)" icon={BookUser} />
        <StatCard value={`${avgScore}%`} label="Avg score" color="var(--color-success)" icon={Sparkles} />
        <StatCard value={`${avgAttendance}%`} label="Avg attendance" color="#f59e0b" icon={CalendarCheck} />
        <StatCard value={topStudent.fullName.split(" ")[0]} label="Top student" color="#4c3ce8" icon={Trophy} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name" />
        <FilterSelect
          placeholder="Group"
          value={group}
          onChange={setGroup}
          options={groups.map((g) => ({ value: g, label: g }))}
        />
        <FilterSelect
          placeholder="Course"
          value={course}
          onChange={setCourse}
          options={courses.map((c) => ({ value: c, label: c }))}
        />
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full name</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Mentor</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead>Average score</TableHead>
              <TableHead>Trend</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  No students match these filters.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar src={row.photo} alt={row.fullName} className="size-9" />
                    <div>
                      <p className="font-medium">{row.fullName}</p>
                      <p className="text-xs text-muted-foreground">{row.course}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{row.group}</TableCell>
                <TableCell className="text-muted-foreground">{row.mentor}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      row.attendance >= 80
                        ? "text-success"
                        : row.attendance >= 50
                          ? "text-amber-600"
                          : "text-destructive"
                    )}
                  >
                    {row.attendance}%
                  </span>
                </TableCell>
                <TableCell>
                  <ScoreBar value={row.averageScore} />
                </TableCell>
                <TableCell>
                  <TrendIcon trend={row.trend} />
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    to="/groups"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Journal <ChevronRight className="size-4" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
