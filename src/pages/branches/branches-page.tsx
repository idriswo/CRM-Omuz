import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, Search, ArrowRight } from "lucide-react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useGetBranchChartQuery, useGetBranchesQuery } from "@/store/services"

const CHART_PALETTE = ["#22b8cf", "#f5a623", "#8b5cf6", "#22c55e", "#ef4444"]
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
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
            {p.name} - {p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export function BranchesPage() {
  const [year, setYear] = useState(2023)
  const [search, setSearch] = useState("")

  const { data: chart } = useGetBranchChartQuery({ year })
  const { data: branches } = useGetBranchesQuery({ search, year })

  const seriesColors: Record<string, string> = Object.fromEntries(
    (branches?.data ?? []).map((b, i) => [b.title, CHART_PALETTE[i % CHART_PALETTE.length]])
  )
  const chartRows = MONTH_LABELS.map((month, i) => {
    const row: Record<string, string | number> = { month }
    for (const branch of branches?.data ?? []) {
      row[branch.title] = chart?.[String(branch.id)]?.[String(i + 1)] ?? 0
    }
    return row
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Branches</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg border border-input bg-card px-2 py-1.5">
            <button onClick={() => setYear((y) => y - 1)} className="rounded p-1 hover:bg-accent" aria-label="Previous year">
              <ChevronLeft className="size-4" />
            </button>
            <span className="min-w-[90px] text-center text-sm font-medium">Year: {year}</span>
            <button onClick={() => setYear((y) => y + 1)} className="rounded p-1 hover:bg-accent" aria-label="Next year">
              <ChevronRight className="size-4" />
            </button>
          </div>
          <Button size="lg">
            <Plus /> ADD NEW
          </Button>
        </div>
      </div>

      <Card>
        <div className="mb-4 flex items-center gap-6">
          {Object.entries(seriesColors).map(([name, color]) => (
            <div key={name} className="flex items-center gap-2 text-sm font-medium">
              <span className="size-2.5 rounded-full" style={{ background: color }} />
              {name}
            </div>
          ))}
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartRows}>
              <CartesianGrid vertical={false} stroke="var(--color-border)" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
              />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
              <Tooltip content={<ChartTooltip />} />
              {(branches?.data ?? []).map((branch) => (
                <Line
                  key={branch.id}
                  type="monotone"
                  dataKey={branch.title}
                  stroke={seriesColors[branch.title]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="w-72">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name"
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>City</TableHead>
              <TableHead>District</TableHead>
              <TableHead>Adress</TableHead>
              <TableHead>Groups</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches?.data?.map((branch) => (
              <TableRow key={branch.id}>
                <TableCell className="font-medium">{branch.title}</TableCell>
                <TableCell>{branch.city}</TableCell>
                <TableCell>{branch.district}</TableCell>
                <TableCell>{branch.address}</TableCell>
                <TableCell>{branch.groups_count}</TableCell>
                <TableCell>{branch.students_count}</TableCell>
                <TableCell>
                  <Badge variant={branch.status === "Active" ? "success" : "secondary"}>
                    {branch.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <ArrowRight className="size-4 text-primary" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
