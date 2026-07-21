import { Fragment, useState } from "react"
import { Link } from "react-router-dom"
import { ChevronDown, ChevronRight, DollarSign, ClipboardCheck, Frown, Wallet, TrendingUp, Landmark } from "lucide-react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Pie, PieChart, Cell } from "recharts"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import {
  useGetAccountingChartQuery,
  useGetAccountingStatsQuery,
  useGetStudentsPaymentQuery,
} from "@/store/services"

const statCards = [
  { key: "total_payment" as const, label: "Total payment", icon: DollarSign, className: "bg-gradient-to-br from-emerald-400 to-emerald-500 text-white", to: "/accounting/payments" },
  { key: "paid_amount" as const, label: "Paid amount", icon: ClipboardCheck, className: "bg-gradient-to-br from-violet-400 to-purple-500 text-white", to: "/accounting/payments" },
  { key: "not_paid" as const, label: "Not paid", icon: Frown, className: "bg-gradient-to-br from-amber-300 to-orange-400 text-white", to: "/accounting/debtors" },
  { key: "net" as const, label: "Net", icon: Wallet, className: "bg-gradient-to-br from-sky-400 to-cyan-500 text-white", to: "/accounting/net" },
]

const navCards = [
  { label: "Payments", icon: DollarSign, to: "/accounting/payments" },
  { label: "Expenses", icon: TrendingUp, to: "/accounting/expenses" },
  { label: "Debtors", icon: Frown, to: "/accounting/debtors" },
  { label: "Accountant", icon: Landmark, to: "/accounting/accountant" },
]

function ChartTooltip({
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
    <div className="rounded-lg border border-border bg-popover p-3 text-sm shadow-md">
      <p className="mb-1.5 text-muted-foreground">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="size-2 rounded-full" style={{ background: p.color }} />
          <span>
            {p.name}: {p.value.toLocaleString()} s
          </span>
        </div>
      ))}
    </div>
  )
}

export function AccountingOverviewPage() {
  const [year] = useState(2023)
  const [openGroups, setOpenGroups] = useState<number[]>([])

  const { data: stats } = useGetAccountingStatsQuery()
  const { data: chart } = useGetAccountingChartQuery({ year })
  const { data: studentsPayment } = useGetStudentsPaymentQuery()

  const toggleGroup = (id: number) =>
    setOpenGroups((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]))

  const donut = studentsPayment?.donut
  const donutData = donut
    ? [
        { name: "Paid amount", value: donut.paid_percent, color: "#a78bfa" },
        { name: "Not paid", value: donut.not_paid_percent, color: "#fb923c" },
      ]
    : []

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Accounting</h1>

      <div className="grid grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.key} to={card.to}>
              <Card className={cn("gap-1 p-5", card.className)}>
                <span className="flex items-center justify-between text-sm font-medium opacity-90">
                  {card.label}
                  <Icon className="size-5 opacity-70" />
                </span>
                <span className="text-2xl font-bold">
                  {(stats?.[card.key] ?? 0).toLocaleString()} s
                </span>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {navCards.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.label} to={card.to}>
              <Card className="flex-row items-center justify-between p-4 transition-colors hover:bg-accent">
                <span className="flex items-center gap-3 font-semibold">
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Icon className="size-4" />
                  </span>
                  {card.label}
                </span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="size-2.5 rounded-full bg-emerald-500" /> Income
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="size-2.5 rounded-full bg-red-500" /> Expense
              </div>
            </div>
            <div className="rounded-lg border border-input bg-card px-3.5 py-2 text-sm">Year: {year}</div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart?.data ?? []}>
                <CartesianGrid vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="Income" stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Expense" stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Students payment</h2>
          <div className="relative flex h-[180px] items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} dataKey="value" innerRadius={55} outerRadius={80} startAngle={90} endAngle={-270}>
                  {donutData.map((d) => (
                    <Cell key={d.name} fill={d.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute flex flex-col items-center">
              <span className="text-xs text-muted-foreground">Total</span>
              <span className="text-2xl font-bold">{donut?.total ?? 0}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-violet-400" /> Paid amount
              </span>
              <span className="font-medium">
                {donut?.paid_percent ?? 0}% - {donut?.paid_count ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-orange-400" /> Not paid
              </span>
              <span className="font-medium">
                {donut?.not_paid_percent ?? 0}% - {donut?.not_paid_count ?? 0}
              </span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-0">
        <div className="flex flex-wrap items-center justify-between gap-4 p-6">
          <h2 className="text-lg font-semibold">Students payment</h2>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-success/15 px-4 py-2 text-sm">
              <span className="text-success">Total payment</span>{" "}
              <span className="font-bold text-success">
                {studentsPayment?.groups.reduce((s, g) => s + g.students, 0) ?? 0} / {studentsPayment?.groups.reduce((s, g) => s + g.total, 0) ?? 0} s
              </span>
            </div>
            <div className="rounded-lg bg-destructive/15 px-4 py-2 text-sm">
              <span className="text-destructive">Not paid</span>{" "}
              <span className="font-bold text-destructive">
                {studentsPayment?.groups.reduce((s, g) => s + g.not_paid, 0) ?? 0} / {studentsPayment?.groups.reduce((s, g) => s + g.not_paid_amount, 0) ?? 0} s
              </span>
            </div>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Group</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Not paid</TableHead>
              <TableHead>Total (somoni)</TableHead>
              <TableHead>Not paid (somoni)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studentsPayment?.groups.map((group) => {
              const open = openGroups.includes(group.id)
              return (
                <Fragment key={group.id}>
                  <TableRow className="cursor-pointer" onClick={() => toggleGroup(group.id)}>
                    <TableCell className="flex items-center gap-2 font-semibold">
                      <ChevronDown className={cn("size-4 text-primary transition-transform", open && "rotate-180")} />
                      {group.group}
                    </TableCell>
                    <TableCell>{group.students}</TableCell>
                    <TableCell>{group.not_paid}</TableCell>
                    <TableCell>{group.total.toLocaleString()} s</TableCell>
                    <TableCell>{group.not_paid_amount.toLocaleString()} s</TableCell>
                  </TableRow>
                  {open && (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={5} className="bg-muted/40 p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Full name</TableHead>
                              <TableHead>Phone</TableHead>
                              <TableHead>Sum</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {group.members.map((m) => (
                              <TableRow key={m.id}>
                                <TableCell className="font-medium">{m.full_name}</TableCell>
                                <TableCell>{m.phone}</TableCell>
                                <TableCell>{m.sum} c</TableCell>
                                <TableCell>
                                  <Badge variant={m.status === "Paid" ? "success" : "destructive"}>{m.status}</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              )
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
