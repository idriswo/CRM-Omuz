import { useState } from "react"
import { Link } from "react-router-dom"
import { ChevronRight, ClipboardList, Crown, FileText, Pencil, Plus, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { PhoneCell } from "@/components/shared/phone-cell"
import { SearchInput } from "@/components/shared/search-input"
import { ViewToggle, type ViewMode } from "@/components/shared/view-toggle"
import {
  useGetGroupsQuery,
  useGetStudentsQuery,
  type ContractStatus,
  type Student,
} from "@/store/services"

const contractLabels: Record<ContractStatus, string> = {
  active: "Active",
  "10_day_left": "10 day left",
  finished: "Finished",
}

function ContractBadge({ status }: { status: ContractStatus }) {
  return (
    <Badge variant={status === "active" ? "success" : "destructive"}>
      {contractLabels[status]}
    </Badge>
  )
}

function StudentName({ student, index }: { student: Student; index?: number }) {
  return (
    <span className="flex items-center gap-2 font-medium">
      {index !== undefined && <span>{index}.</span>}
      {student.full_name}
      {student.is_top && <Crown className="size-4 fill-amber-400 text-amber-500" />}
    </span>
  )
}

function StudentCard({ student }: { student: Student }) {
  const group = student.groups[0]
  return (
    <Card className="gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-lg font-bold">
            {student.is_top && <Crown className="size-4 fill-amber-400 text-amber-500" />}
            <span className="truncate">{student.full_name}</span>
          </p>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <span
              className={cn(
                "size-2.5 rounded-full",
                student.status === "active" ? "bg-success" : "bg-muted-foreground/40"
              )}
            />
            <PhoneCell
              phone={student.phone}
              contacts={[
                { label: "Student", number: student.phone },
                { label: "Father", number: student.father_phone },
              ]}
            />
            <span className="text-border">|</span>
            <span>{student.age} year</span>
            <span className="text-border">|</span>
            <span className="capitalize">{student.gender}</span>
          </div>
        </div>
        <Avatar src={student.photo} alt={student.full_name} className="size-11" />
      </div>

      {group && (
        <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/60 p-3">
          <div className="min-w-0">
            <Link
              to={`/groups/${group.id}`}
              className="flex items-center gap-1 font-semibold hover:text-primary"
            >
              <span className="truncate">{group.name}</span>
              <ChevronRight className="size-4" />
            </Link>
            <p className="text-sm text-muted-foreground">{group.period}</p>
          </div>
          <Button variant="ghost" size="icon" className="bg-accent text-primary" asChild>
            <Link to={`/groups/${group.id}/journal`} aria-label="Open journal">
              <ClipboardList className="size-4" />
            </Link>
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm">
          Status:{" "}
          <span className={student.status === "active" ? "font-semibold text-success" : "font-semibold"}>
            {student.status === "active" ? "Active" : student.status === "inactive" ? "No Active" : "Finished"}
          </span>
        </p>
        <Button variant="ghost" size="icon" asChild>
          <Link to={`/students/${student.id}/edit`} aria-label="Edit student">
            <Pencil className="size-4 text-primary" />
          </Link>
        </Button>
      </div>
    </Card>
  )
}

export function StudentsPage() {
  const [view, setView] = useState<ViewMode>("list")
  const [search, setSearch] = useState("")
  const [contract, setContract] = useState(ALL)
  const [status, setStatus] = useState(ALL)
  const [course, setCourse] = useState(ALL)
  const [group, setGroup] = useState(ALL)

  const { data: groups } = useGetGroupsQuery({ limit: 50 })
  const { data, isLoading } = useGetStudentsQuery({
    search,
    limit: 12,
    contract_status: contract === ALL ? undefined : (contract as ContractStatus),
    status: status === ALL ? undefined : (status as Student["status"]),
    group_id: group === ALL ? undefined : Number(group),
  })

  const students = data?.data ?? []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Students</h1>
        <Button size="lg" asChild>
          <Link to="/students/new">
            <Plus /> Add new
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name" />
        <FilterSelect
          placeholder="Course"
          value={course}
          onChange={setCourse}
          options={[...new Set((groups?.data ?? []).map((g) => g.course))].map((c) => ({
            value: c,
            label: c,
          }))}
        />
        <FilterSelect
          placeholder="Group"
          value={group}
          onChange={setGroup}
          options={(groups?.data ?? []).map((g) => ({ value: String(g.id), label: g.name }))}
        />
        <FilterSelect
          placeholder="Status"
          value={status}
          onChange={setStatus}
          options={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "No Active" },
            { value: "finished", label: "Finished" },
          ]}
        />
        <FilterSelect
          placeholder="Contract"
          value={contract}
          onChange={setContract}
          options={[
            { value: "active", label: "Active" },
            { value: "10_day_left", label: "10 day left" },
            { value: "finished", label: "Finished" },
          ]}
        />
        <div className="ml-auto">
          <ViewToggle value={view} onChange={setView} />
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {students.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      ) : (
        <Card className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full name</TableHead>
                <TableHead>Groups</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Contract</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              )}
              {students.map((student, index) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <StudentName student={student} index={index + 1} />
                  </TableCell>
                  <TableCell>{student.groups.map((g) => g.name).join(", ") || "-"}</TableCell>
                  <TableCell>
                    <PhoneCell
                      phone={student.phone}
                      contacts={[
                        { label: "Student", number: student.phone },
                        { label: "Father", number: student.father_phone },
                      ]}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge variant={student.status === "active" ? "success" : "secondary"}>
                      {student.status === "active"
                        ? "Active"
                        : student.status === "inactive"
                          ? "No Active"
                          : "Finished"}
                    </Badge>
                  </TableCell>
                  <TableCell>{student.has_account ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <ContractBadge status={student.contract_status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/students/${student.id}/contract`} aria-label="Manage contract">
                          <FileText className="size-4 text-muted-foreground" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/students/${student.id}/edit`} aria-label="Edit student">
                          <Pencil className="size-4 text-primary" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" aria-label="Delete student">
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
