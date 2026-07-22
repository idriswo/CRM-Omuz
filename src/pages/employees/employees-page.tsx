import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { LayoutGrid, List, Plus, Search, SquarePen, Star, Trash2, UserRound } from "lucide-react"

import { cn } from "@/lib/utils"
import { apiErrorMessage } from "@/lib/api-error"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Pagination } from "@/components/shared/pagination"
import { Toast } from "@/components/shared/toast"
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
import { RoleBadge } from "./badges"
import { positionLabel } from "./employee-format"
import {
  useDeleteEmployeeMutation,
  useGetBranchesQuery,
  useGetEmployeesQuery,
  type Employee,
} from "@/store/services"

type View = "grid" | "list"

const ALL = "all"
const PAGE_SIZE = 12

export function EmployeesPage() {
  const navigate = useNavigate()
  const [view, setView] = useState<View>("grid")
  const [search, setSearch] = useState("")
  const [position, setPosition] = useState<string>(ALL)
  const [branch, setBranch] = useState<string>(ALL)
  const [page, setPage] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Employee | null>(null)

  const debouncedSearch = useDebouncedValue(search)

  const { data, isLoading, isError, isFetching } = useGetEmployeesQuery({
    search: debouncedSearch || undefined,
    position: position === ALL ? undefined : position,
    branch_id: branch === ALL ? undefined : Number(branch),
    page,
    limit: PAGE_SIZE,
  })
  const { data: branches } = useGetBranchesQuery()
  const [deleteEmployee, { isLoading: deleting }] = useDeleteEmployeeMutation()

  /** Position is free text on the backend and there is no /positions endpoint,
   * so the filter options come from the values actually present in the data. */
  const { data: everyone } = useGetEmployeesQuery({ limit: 200 })
  const positions = useMemo(
    () => [...new Set((everyone?.data ?? []).map((e) => e.position).filter(Boolean))],
    [everyone]
  )

  const branchNames = useMemo(
    () => new Map((branches?.data ?? []).map((b) => [b.id, b.title])),
    [branches]
  )

  const employees = data?.data ?? []
  const meta = data?.meta

  /** Any filter change invalidates the current page number. */
  const resetTo = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value)
    setPage(1)
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    const employee = pendingDelete
    try {
      await deleteEmployee(employee.id).unwrap()
      setPendingDelete(null)
      // Stepping back off a page that no longer exists after the last row went.
      if (employees.length === 1 && page > 1) setPage((current) => current - 1)
    } catch (err) {
      // 409 = the backend refuses because timetable entries / salary / avans
      // rows still point at this employee.
      setPendingDelete(null)
      setError(
        apiErrorMessage(err, {
          conflict: `${employee.fullName} can't be deleted — they are still used in a timetable, salary or avans record.`,
          fallback: `Could not delete ${employee.fullName}.`,
        })
      )
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Title + primary actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Employees</h1>
        <div className="flex items-center gap-3">
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
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>

        <Select value={position} onValueChange={resetTo(setPosition)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All positions</SelectItem>
            {positions.map((p) => (
              <SelectItem key={p} value={p}>
                {positionLabel(p)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={branch} onValueChange={resetTo(setBranch)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All branches</SelectItem>
            {(branches?.data ?? []).map((b) => (
              <SelectItem key={b.id} value={String(b.id)}>
                {b.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ViewToggle view={view} onChange={setView} className="ml-auto" />
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading employees…</p>}
      {isError && <p className="text-sm text-destructive">Could not load employees.</p>}
      {!isLoading && !isError && employees.length === 0 && (
        <p className="text-sm text-muted-foreground">No employees found.</p>
      )}

      {view === "grid" ? (
        <div
          className={cn(
            "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3",
            isFetching && "opacity-60 transition-opacity"
          )}
        >
          {employees.map((e) => (
            <EmployeeCard
              key={e.id}
              employee={e}
              onEdit={() => navigate(`/employees/${e.id}/edit`)}
              onDelete={() => setPendingDelete(e)}
              disabled={deleting}
            />
          ))}
        </div>
      ) : (
        <EmployeeTable
          employees={employees}
          branchNames={branchNames}
          onEdit={(id) => navigate(`/employees/${id}/edit`)}
          onDelete={setPendingDelete}
          disabled={deleting}
          fetching={isFetching}
        />
      )}

      {meta && (
        <Pagination
          page={meta.page}
          limit={meta.limit}
          total={meta.total}
          onPageChange={setPage}
        />
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(next) => !next && setPendingDelete(null)}
        title="Delete employee?"
        description={
          pendingDelete
            ? `${pendingDelete.fullName} will be removed permanently. This can't be undone.`
            : undefined
        }
        loading={deleting}
        onConfirm={confirmDelete}
      />

      {error && (
        <Toast message={error} variant="error" duration={6000} onClose={() => setError(null)} />
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

function EmployeeCard({
  employee,
  onEdit,
  onDelete,
  disabled,
}: {
  employee: Employee
  onEdit: () => void
  onDelete: () => void
  disabled: boolean
}) {
  return (
    <Card className="gap-0 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold">{employee.fullName}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {employee.phone}
            {employee.experience != null && (
              <>
                <span className="mx-1 text-border">|</span>
                {employee.experience} yr exp
              </>
            )}
          </p>
          {employee.email && (
            <p className="truncate text-sm text-muted-foreground">{employee.email}</p>
          )}
        </div>
        <Avatar />
      </div>

      <div className="mt-6 flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <RoleBadge role={employee.position} />
          {employee.mentor_level?.level && (
            <span className="inline-flex w-fit items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
              {employee.mentor_level.level}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Edit employee" onClick={onEdit}>
            <SquarePen className="size-4 text-primary" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete employee"
            onClick={onDelete}
            disabled={disabled}
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

function EmployeeTable({
  employees: rows,
  branchNames,
  onEdit,
  onDelete,
  disabled,
  fetching,
}: {
  employees: Employee[]
  branchNames: Map<number, string>
  onEdit: (id: number) => void
  onDelete: (employee: Employee) => void
  disabled: boolean
  fetching?: boolean
}) {
  return (
    <Card className={cn("p-0", fetching && "opacity-60 transition-opacity")}>
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/60">
            <TableHead>FULL NAME</TableHead>
            <TableHead>POSITION</TableHead>
            <TableHead>PHONE</TableHead>
            <TableHead>BRANCH</TableHead>
            <TableHead>EXPERIENCE</TableHead>
            <TableHead className="text-right">ACTION</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((e) => (
            <TableRow key={e.id}>
              <TableCell className="font-medium">{e.fullName}</TableCell>
              <TableCell>
                <RoleBadge role={e.position} />
              </TableCell>
              <TableCell className="text-muted-foreground">{e.phone}</TableCell>
              <TableCell className="text-muted-foreground">
                {e.branch_id ? (branchNames.get(e.branch_id) ?? `#${e.branch_id}`) : "—"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {e.experience != null ? `${e.experience} yr` : "—"}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => onEdit(e.id)}>
                    <SquarePen className="size-4 text-primary" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete"
                    onClick={() => onDelete(e)}
                    disabled={disabled}
                  >
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

function Avatar() {
  return (
    <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
      <UserRound className="size-7 text-muted-foreground/60" />
    </div>
  )
}
