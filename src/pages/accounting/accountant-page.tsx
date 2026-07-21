import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

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
import { AccountingHeader } from "./components/accounting-header"
import { DateField } from "./components/filter-field"
import { SelectFilterField } from "./components/select-filter-field"
import { cn } from "@/lib/utils"
import { useGetAccountantChartQuery, useGetAccountantQuery } from "@/store/services"

const statusOptions = [
  { value: "all", label: "All status" },
  { value: "inprogress", label: "Inprogress" },
  { value: "archive", label: "Archive" },
]

const branchOptions = [
  { value: "all", label: "All branches" },
  { value: "Sadbarg", label: "Sadbarg" },
  { value: "Profsous", label: "Profsous" },
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
      <p className="mb-1.5 font-medium text-foreground">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="size-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium">{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

export function AccountantPage() {
  const [year, setYear] = useState(2024)
  const [month, setMonth] = useState("May")
  const [status, setStatus] = useState("all")
  const [branch, setBranch] = useState("all")
  const [date, setDate] = useState("July 2023")

  const { data: chart } = useGetAccountantChartQuery({ year })
  const { data, isLoading } = useGetAccountantQuery({ status, branch_id: branch })

  return (
    <div className="flex flex-col gap-6">
      <AccountingHeader title="Accountant" />

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
          <div className="flex items-center gap-1 rounded-lg border border-input bg-card px-2 py-1.5">
            <button onClick={() => setYear((y) => y - 1)} className="rounded p-1 hover:bg-accent" aria-label="Previous year">
              <ChevronLeft className="size-4" />
            </button>
            <span className="min-w-[80px] text-center text-sm font-medium">{year} year</span>
            <button onClick={() => setYear((y) => y + 1)} className="rounded p-1 hover:bg-accent" aria-label="Next year">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart?.data ?? []}>
              <defs>
                <linearGradient id="accountantIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="accountantExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="income" name="Income" stroke="#22c55e" strokeWidth={2} fill="url(#accountantIncome)" />
              <Area type="monotone" dataKey="expense" name="Expense" stroke="#ef4444" strokeWidth={2} fill="url(#accountantExpense)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-between px-2 text-sm text-muted-foreground">
          {(chart?.data ?? []).map((point) => (
            <button
              key={point.month}
              onClick={() => setMonth(point.month)}
              className={cn(
                "rounded-md px-2 py-1 transition-colors hover:text-foreground",
                month === point.month && "border border-input bg-card font-medium text-foreground"
              )}
            >
              {point.month}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <SelectFilterField label="Status" value={status} onValueChange={setStatus} options={statusOptions} />
        <SelectFilterField label="Branch" value={branch} onValueChange={setBranch} options={branchOptions} />
        <DateField label="Date" value={date} onChange={setDate} />
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Started at</TableHead>
              <TableHead>Finished at</TableHead>
              <TableHead>Total income</TableHead>
              <TableHead>Total expense</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Not paid</TableHead>
              <TableHead>Net</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {data?.data.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.started_at}</TableCell>
                <TableCell>{a.finished_at}</TableCell>
                <TableCell>{a.total_income}</TableCell>
                <TableCell>{a.total_expense}</TableCell>
                <TableCell>{a.paid}</TableCell>
                <TableCell>{a.not_paid}</TableCell>
                <TableCell>{a.net}</TableCell>
                <TableCell>{a.branch}</TableCell>
                <TableCell>
                  <Badge variant={a.status === "Inprogress" ? "default" : "secondary"}>{a.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
