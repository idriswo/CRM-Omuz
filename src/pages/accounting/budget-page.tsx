import { useState } from "react"
import { Upload, Plus } from "lucide-react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Button } from "@/components/ui/button"
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
import { useGetBudgetChartQuery, useGetBudgetQuery } from "@/store/services"

const statusOptions = [
  { value: "all", label: "All status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
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
            Amount {p.name}: {p.value.toLocaleString()} s
          </span>
        </div>
      ))}
    </div>
  )
}

export function BudgetPage() {
  const [status, setStatus] = useState("all")
  const [date, setDate] = useState("July 2023")
  const [from, setFrom] = useState("Jan 2023")
  const [to, setTo] = useState("Dec 2023")

  const { data: chart } = useGetBudgetChartQuery({ from: 0, to: 11 })
  const { data, isLoading } = useGetBudgetQuery({ status })

  return (
    <div className="flex flex-col gap-6">
      <AccountingHeader
        title="Budget plan"
        actions={
          <Button variant="outline" size="lg">
            <Upload /> EXPORT
          </Button>
        }
      />

      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="size-2.5 rounded-full bg-emerald-500" /> Amount allocated
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="size-2.5 rounded-full bg-red-500" /> Amount spent
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DateField label="Frome" value={from} onChange={setFrom} className="w-40" />
            <DateField label="To" value={to} onChange={setTo} className="w-40" />
          </div>
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chart?.data ?? []}>
              <CartesianGrid vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="amount_allocated" name="Allocated" stroke="#22c55e" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="amount_spent" name="Spent" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <SelectFilterField label="Status" value={status} onValueChange={setStatus} options={statusOptions} className="w-48" />
          <DateField label="Date" value={date} onChange={setDate} className="w-48" />
        </div>
        <Button size="lg">
          <Plus /> ADD NEW
        </Button>
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category name</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Amount allocated</TableHead>
              <TableHead>Amount spent</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {data?.data?.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium">{b.category_name}</TableCell>
                <TableCell>{b.from_date}</TableCell>
                <TableCell>{b.to_date}</TableCell>
                <TableCell>{b.amount_allocated}</TableCell>
                <TableCell>{b.amount_spent}</TableCell>
                <TableCell>
                  <Badge variant={b.status === "Active" ? "success" : "outline"}>{b.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
