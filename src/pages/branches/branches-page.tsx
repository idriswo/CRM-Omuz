import { useState } from "react"
import { ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2 } from "lucide-react"
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
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Toast } from "@/components/shared/toast"
import { apiErrorMessage } from "@/lib/api-error"
import {
  useDeleteBranchMutation,
  useGetBranchChartQuery,
  useGetBranchesQuery,
  type Branch,
} from "@/store/services"
import { BranchDialog } from "./branch-dialog"

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
  const [year, setYear] = useState(new Date().getFullYear())
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Branch | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Branch | null>(null)
  const [error, setError] = useState("")

  const { data: chart } = useGetBranchChartQuery({ year })
  const { data: branches } = useGetBranchesQuery({ search, year })
  const [deleteBranch, { isLoading: deleting }] = useDeleteBranchMutation()

  const openCreate = () => {
    setEditing(null)
    setDialogOpen(true)
  }

  const openEdit = (branch: Branch) => {
    setEditing(branch)
    setDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    const branch = pendingDelete
    setPendingDelete(null)
    try {
      await deleteBranch(branch.id).unwrap()
    } catch (err) {
      setError(
        apiErrorMessage(err, {
          conflict: `"${branch.title}" can't be deleted — it still has groups or students attached.`,
          fallback: `Could not delete "${branch.title}".`,
        })
      )
    }
  }

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
          <Button size="lg" onClick={openCreate}>
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
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${branch.title}`}
                      onClick={() => openEdit(branch)}
                    >
                      <Pencil className="size-4 text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${branch.title}`}
                      onClick={() => setPendingDelete(branch)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {branches?.data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                  No branches yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <BranchDialog open={dialogOpen} onOpenChange={setDialogOpen} branch={editing} />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title={`Delete "${pendingDelete?.title}"?`}
        description="This branch will be removed permanently."
        loading={deleting}
        onConfirm={confirmDelete}
      />

      {error && <Toast message={error} variant="error" onClose={() => setError("")} />}
    </div>
  )
}
