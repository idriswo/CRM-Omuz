import { useState } from "react"
import { Link } from "react-router-dom"
import { ChevronRight, DollarSign, ClipboardCheck, Frown, Wallet, TrendingUp, Landmark } from "lucide-react"
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

/** Keys match `GET /accounting/overview`; `net` only comes back for roles that
 * are allowed to see salaries, so it falls back to 0. */
const statCards = [
  { key: "total_income" as const, label: "Total income", icon: DollarSign, className: "bg-gradient-to-br from-emerald-400 to-emerald-500 text-white", to: "/accounting/payments" },
  { key: "total_expenses" as const, label: "Total expenses", icon: ClipboardCheck, className: "bg-gradient-to-br from-violet-400 to-purple-500 text-white", to: "/accounting/expenses" },
  { key: "total_debt" as const, label: "Not paid", icon: Frown, className: "bg-gradient-to-br from-amber-300 to-orange-400 text-white", to: "/accounting/debtors" },
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
  const [year] = useState(new Date().getFullYear())

  const { data: stats } = useGetAccountingStatsQuery()
  const { data: chart } = useGetAccountingChartQuery({ year })
  const { data: studentsPayment } = useGetStudentsPaymentQuery()

  // The endpoint returns one row per student, so the paid / not-paid split is
  // counted here rather than read off a `donut` object the API never sends.
  const rows = studentsPayment?.data ?? []
  const totalAmount = rows.reduce((sum, r) => sum + r.total_amount, 0)
  const totalPaid = rows.reduce((sum, r) => sum + r.total_paid, 0)
  const totalRemaining = rows.reduce((sum, r) => sum + r.remaining, 0)
  const paidCount = rows.filter((r) => r.remaining <= 0).length
  const notPaidCount = rows.length - paidCount
  const pct = (part: number) => (rows.length ? Math.round((part / rows.length) * 100) : 0)

  const donutData = rows.length
    ? [
        { name: "Paid amount", value: pct(paidCount), color: "#a78bfa" },
        { name: "Not paid", value: pct(notPaidCount), color: "#fb923c" },
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
              <span className="text-2xl font-bold">{rows.length}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-violet-400" /> Paid amount
              </span>
              <span className="font-medium">
                {pct(paidCount)}% - {paidCount}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-orange-400" /> Not paid
              </span>
              <span className="font-medium">
                {pct(notPaidCount)}% - {notPaidCount}
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
              <span className="text-success">Paid</span>{" "}
              <span className="font-bold text-success">
                {totalPaid.toLocaleString()} / {totalAmount.toLocaleString()} s
              </span>
            </div>
            <div className="rounded-lg bg-destructive/15 px-4 py-2 text-sm">
              <span className="text-destructive">Not paid</span>{" "}
              <span className="font-bold text-destructive">
                {notPaidCount} / {totalRemaining.toLocaleString()} s
              </span>
            </div>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full name</TableHead>
              <TableHead>Total (somoni)</TableHead>
              <TableHead>Paid (somoni)</TableHead>
              <TableHead>Remaining (somoni)</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.student_id}>
                <TableCell className="font-medium">{row.full_name}</TableCell>
                <TableCell>{row.total_amount.toLocaleString()} s</TableCell>
                <TableCell>{row.total_paid.toLocaleString()} s</TableCell>
                <TableCell>{row.remaining.toLocaleString()} s</TableCell>
                <TableCell>
                  <Badge variant={row.remaining <= 0 ? "success" : "destructive"}>
                    {row.remaining <= 0 ? "Paid" : "Not paid"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  No payments yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
