import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Calendar,
  CaretLeft,
  CaretRight,
  ClipboardText,
  GraduationCap,
  Play,
  Users,
  UserSquare,
  ListBullets,
} from "@phosphor-icons/react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ReasonDialog } from "./reason-dialog"
import {
  useGetAttendanceChartQuery,
  useGetAttendanceLogQuery,
  useGetDashboardStatsQuery,
  useGetEmployedGraduatesQuery,
  useGetEnrollChartQuery,
  useGetGroupsSummaryQuery,
  useGetIncomeThisMonthQuery,
  useGetLeadsChartQuery,
  useGetDashboardLeftCoursesQuery,
} from "@/store/services"

function SimpleTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover p-2.5 text-xs shadow-md">
      {label && <p className="mb-1 text-muted-foreground">{label}</p>}
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-1.5">
          <span className="size-2 rounded-full" style={{ background: p.color }} />
          <span>
            {p.name}: {p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  )
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-")
  return `${d}.${m}.${y}`
}

export function DashboardPage() {
  const [date, setDate] = useState("2024-08-28")
  const [leadsYear, setLeadsYear] = useState(2024)
  const [incomeMonth, setIncomeMonth] = useState("December")
  const [attendanceMonth, setAttendanceMonth] = useState("February 2024")
  const [reasonOverrides, setReasonOverrides] = useState<Record<number, string>>({})

  const { data: stats } = useGetDashboardStatsQuery()
  const { data: attendanceLog } = useGetAttendanceLogQuery()
  const { data: groups } = useGetGroupsSummaryQuery()
  const { data: leadsChart } = useGetLeadsChartQuery({ year: leadsYear })
  const { data: attendanceChart } = useGetAttendanceChartQuery({ month: attendanceMonth })
  const { data: income } = useGetIncomeThisMonthQuery({ month: incomeMonth })
  const { data: enroll } = useGetEnrollChartQuery()
  const { data: graduates } = useGetEmployedGraduatesQuery({ limit: 5 })
  const { data: leftCourses } = useGetDashboardLeftCoursesQuery()

  const incomePct = income?.percent ?? 0
  const incomeDonut = [
    { name: "Income", value: incomePct, color: "#8b5cf6" },
    { name: "Rest", value: 100 - incomePct, color: "var(--color-muted)" },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="relative">
          <span className="absolute -top-2.5 left-3 z-10 bg-background px-1 text-xs text-muted-foreground">Date</span>
          <div className="relative flex h-11 items-center gap-2 rounded-lg border border-input bg-card px-3.5 text-sm">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              aria-label="Dashboard date"
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            <span className="pointer-events-none">{formatDate(date)}</span>
            <Calendar weight="duotone" className="pointer-events-none size-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-4">
            <Card className="items-center gap-1 p-4">
              <span className="text-2xl font-bold text-primary">{stats?.students_count ?? 0}</span>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <GraduationCap weight="duotone" className="size-4" /> Students
              </span>
            </Card>
            <Card className="items-center gap-1 p-4">
              <span className="text-2xl font-bold text-primary">{stats?.users_count ?? 0}</span>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users weight="duotone" className="size-4" /> Users
              </span>
            </Card>
            <Card className="items-center gap-1 p-4">
              <span className="text-2xl font-bold text-primary">{stats?.employees_count ?? 0}</span>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <UserSquare weight="duotone" className="size-4" /> Employees
              </span>
            </Card>
          </div>

          <Card className="p-0">
            <div className="flex items-center justify-between p-6 pb-0">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <ListBullets weight="duotone" className="size-5" /> Groups
              </h2>
              <span className="text-xl font-bold text-primary">{groups?.data?.length ?? 0}</span>
            </div>
            <div className="flex flex-col divide-y divide-border px-6 py-2">
              {groups?.data?.map((g) => (
                <div key={g.id} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Play weight="fill" className="size-3.5" />
                    </span>
                    <span>
                      <div className="font-semibold">{g.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Absent: {g.absent} Late: {g.late}
                      </div>
                    </span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="text-right text-sm">
                      <div className="font-semibold text-success">{g.income.toLocaleString()} c</div>
                      <div className="text-xs text-muted-foreground">Income</div>
                    </span>
                    <ClipboardText weight="duotone" className="size-4 text-primary" />
                    <CaretRight className="size-4 text-muted-foreground" />
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Leads</h2>
              <div className="flex items-center gap-1 rounded-lg border border-input px-2 py-1">
                <button onClick={() => setLeadsYear((y) => y - 1)} className="rounded p-1 hover:bg-accent" aria-label="Previous year">
                  <CaretLeft className="size-4" />
                </button>
                <span className="text-sm font-medium">{leadsYear} y</span>
                <button onClick={() => setLeadsYear((y) => y + 1)} className="rounded p-1 hover:bg-accent" aria-label="Next year">
                  <CaretRight className="size-4" />
                </button>
              </div>
            </div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={leadsChart?.data ?? []}>
                  <defs>
                    <linearGradient id="leadsFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                  <Tooltip content={<SimpleTooltip />} />
                  <Area type="monotone" dataKey="count" name="Leads" stroke="#f59e0b" strokeWidth={2} fill="url(#leadsFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="p-0">
            <div className="grid grid-cols-3 gap-3 p-6 pb-4">
              <div className="rounded-lg bg-success/15 px-3 py-2.5">
                <div className="text-sm text-success">Present</div>
                <div className="text-xl font-bold text-success">{stats?.present ?? 0}</div>
              </div>
              <div className="rounded-lg bg-destructive/15 px-3 py-2.5">
                <div className="text-sm text-destructive">Absent</div>
                <div className="text-xl font-bold text-destructive">{stats?.absent ?? 0}</div>
              </div>
              <div className="rounded-lg bg-amber-500/15 px-3 py-2.5">
                <div className="text-sm text-amber-600">Late</div>
                <div className="text-xl font-bold text-amber-600">{stats?.late ?? 0}</div>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceLog?.data?.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div className="font-medium">{a.full_name}</div>
                      <Link to="#" className="text-xs text-primary">
                        {a.group} ›
                      </Link>
                    </TableCell>
                    <TableCell>{a.phone}</TableCell>
                    <TableCell className="max-w-[220px] text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <ReasonDialog
                          studentName={a.full_name}
                          reason={reasonOverrides[a.id] ?? a.reason}
                          onSave={(reason) =>
                            setReasonOverrides((prev) => ({ ...prev, [a.id]: reason }))
                          }
                        />
                        <span className="truncate">{reasonOverrides[a.id] ?? a.reason}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold">Income In this month</h2>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-3">
                <span className="text-3xl font-bold">{income?.amount?.toLocaleString() ?? 0} c</span>
                <span className="text-sm text-muted-foreground">
                  {income?.diff_from_last_month ?? 0}% less than last month
                </span>
                <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-sm font-medium w-fit">
                  <button onClick={() => setIncomeMonth("November")} className="hover:text-primary" aria-label="Previous month">
                    <CaretLeft className="size-4" />
                  </button>
                  {incomeMonth}
                  <button onClick={() => setIncomeMonth("January")} className="hover:text-primary" aria-label="Next month">
                    <CaretRight className="size-4" />
                  </button>
                </div>
              </div>
              <div className="relative flex size-[140px] items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={incomeDonut} dataKey="value" innerRadius={48} outerRadius={68} startAngle={90} endAngle={-270}>
                      {incomeDonut.map((d) => (
                        <Cell key={d.name} fill={d.color} stroke="none" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <span className="pointer-events-none absolute text-xl font-bold">{incomePct}%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-semibold">Attendance</h2>
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="size-2.5 rounded-full bg-emerald-500" /> Late
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="size-2.5 rounded-full bg-red-500" /> Absent
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-input px-2 py-1">
            <button
              onClick={() => setAttendanceMonth("January 2024")}
              className="rounded p-1 hover:bg-accent"
              aria-label="Previous month"
            >
              <CaretLeft className="size-4" />
            </button>
            <span className="text-sm font-medium">{attendanceMonth}</span>
            <button
              onClick={() => setAttendanceMonth("March 2024")}
              className="rounded p-1 hover:bg-accent"
              aria-label="Next month"
            >
              <CaretRight className="size-4" />
            </button>
          </div>
        </div>
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={attendanceChart?.data ?? []}>
              <defs>
                <linearGradient id="lateFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="absentFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
              <Tooltip content={<SimpleTooltip />} />
              <Area type="monotone" dataKey="late" name="Late" stroke="#22c55e" strokeWidth={2} fill="url(#lateFill)" />
              <Area type="monotone" dataKey="absent" name="Absent" stroke="#ef4444" strokeWidth={2} fill="url(#absentFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Enroll</h2>
            <Link to="/students/enroll" className="flex items-center gap-1 text-sm font-medium text-primary">
              See more <CaretRight className="size-4" />
            </Link>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enroll?.chart ?? []}>
                <defs>
                  <linearGradient id="enrollFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <Tooltip content={<SimpleTooltip />} />
                <Area type="monotone" dataKey="count" name="Enroll" stroke="#6366f1" strokeWidth={2} fill="url(#enrollFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enroll?.data?.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.full_name}</TableCell>
                  <TableCell>{e.course}</TableCell>
                  <TableCell>{e.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="p-0">
            <div className="flex items-center justify-between p-6 pb-0">
              <h2 className="text-lg font-semibold">Employed graduates ({graduates?.meta?.total ?? 0})</h2>
              <Link to="/students/graduates" className="flex items-center gap-1 text-sm font-medium text-primary">
                See more <CaretRight className="size-4" />
              </Link>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full name</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Date of issue</TableHead>
                  <TableHead>Work</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {graduates?.data?.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="flex size-8 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
                          {g.full_name.charAt(0)}
                        </span>
                        <span>
                          <div className="font-medium">{g.full_name}</div>
                          <div className="text-xs text-primary">{g.age}</div>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{g.course}</TableCell>
                    <TableCell>{g.date_of_issue}</TableCell>
                    <TableCell className="font-medium">{g.work_place}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Left courses</h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/students/left-courses">
                  <ListBullets weight="duotone" className="size-4" /> Show list
                </Link>
              </Button>
            </div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leftCourses?.data ?? []}>
                  <CartesianGrid vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                  <YAxis hide />
                  <Tooltip content={<SimpleTooltip />} cursor={{ fill: "var(--color-muted)" }} />
                  <Bar dataKey="count" name="Left courses" fill="#60a5fa" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
