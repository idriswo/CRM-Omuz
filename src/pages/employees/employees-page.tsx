import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Code2, LayoutGrid, List, Plus, Search, SquarePen, Star, Trash2, UserRound } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { positions, statuses } from "./mock-data"
import { usePersistedState } from "@/hooks/use-persisted-state"
import { RoleBadge } from "./badges"
import { useGetEmployeesQuery, type Employee } from "@/store/services"

type View = "grid" | "list"

export function EmployeesPage() {
  const navigate = useNavigate()
  const [view, setView] = usePersistedState<View>("employees:view", "grid")
  const [search, setSearch] = useState("")

  const { data } = useGetEmployeesQuery({ search })
  const filtered = data?.data ?? []

  return (
    <div className="flex flex-col gap-6">
      {/* Title + primary actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Employees</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="lg">
            <Code2 className="text-primary" /> Position
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate("/employees/mentor-levels")}>
            <Star className="text-primary" /> Mentor levels
          </Button>
          <Button size="lg" onClick={() => navigate("/employees/new")}>
            <Plus /> Add new
          </Button>
        </div>
      </div>

      {/* Filters + view toggle */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name"
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Position" />
          </SelectTrigger>
          <SelectContent>
            {positions.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ViewToggle view={view} onChange={setView} className="ml-auto" />
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((e) => (
            <EmployeeCard key={e.id} employee={e} />
          ))}
        </div>
      ) : (
        <EmployeeTable employees={filtered} />
      )}
    </div>
  )
}

function ViewToggle({
  view,
  onChange,
  className,
}: {
  view: View
  onChange: (v: View) => void
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-1 rounded-lg bg-secondary p-1", className)}>
      {(
        [
          ["grid", LayoutGrid],
          ["list", List],
        ] as const
      ).map(([key, Icon]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          aria-label={`${key} view`}
          className={cn(
            "flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors",
            view === key && "bg-card text-primary shadow-sm"
          )}
        >
          <Icon className="size-4" />
        </button>
      ))}
    </div>
  )
}

function EmployeeCard({ employee }: { employee: Employee }) {
  return (
    <Card className="gap-0 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold">{employee.fullName}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {employee.phone} <span className="mx-1 text-border">|</span> {employee.age} year
          </p>
        </div>
        <Avatar photo={employee.photo} />
      </div>

      <div className="mt-6 flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {employee.roles.map((r) => (
            <RoleBadge key={r} role={r} />
          ))}
        </div>
        <Button variant="ghost" size="icon" aria-label="Edit employee">
          <SquarePen className="size-4 text-primary" />
        </Button>
      </div>
    </Card>
  )
}

function EmployeeTable({ employees: rows }: { employees: Employee[] }) {
  return (
    <Card className="p-0">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/60">
            <TableHead>FULL NAME</TableHead>
            <TableHead>POSITION</TableHead>
            <TableHead>PHONE</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead className="text-right">ACTION</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((e) => (
            <TableRow key={e.id}>
              <TableCell className="font-medium">{e.fullName}</TableCell>
              <TableCell>
                <div className="flex flex-wrap items-center gap-2">
                  {e.roles.map((r) => (
                    <RoleBadge key={r} role={r} />
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{e.phone}</TableCell>
              <TableCell>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    e.status === "Active"
                      ? "text-green-600 dark:text-green-400"
                      : "text-destructive"
                  )}
                >
                  {e.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" aria-label="Edit">
                    <SquarePen className="size-4 text-primary" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Delete">
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

function Avatar({ photo }: { photo?: string }) {
  return (
    <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
      {photo ? (
        <img src={photo} alt="" className="size-full object-cover" />
      ) : (
        <UserRound className="size-7 text-muted-foreground/60" />
      )}
    </div>
  )
}
