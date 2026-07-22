import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  ArrowLeft,
  ChevronRight,
  ClipboardList,
  CalendarDays,
  CornerDownLeft,
  Download,
  FileText,
  FolderOpen,
  LayoutGrid,
  Pencil,
  Plus,
  Send,
  Trash2,
  Upload,
  User,
  UserMinus,
  UserRoundMinus,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PhoneCell } from "@/components/shared/phone-cell"
import { ScheduleSheet } from "./schedule-sheet"
import { MentorsSheet } from "./mentors-sheet"
import { StudentInfoSheet } from "@/components/shared/student-info-sheet"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Toast } from "@/components/shared/toast"
import {
  ChangeStatusDialog,
  ImportDialog,
  NewGroupDialog,
  NewStudentDialog,
  TransferDialog,
} from "./group-dialogs"
import {
  useDeleteStudentMutation,
  useEnrollStudentMutation,
  useGetGroupQuery,
  useUpdateStudentMutation,
} from "@/store/services"

export function GroupDetailPage() {
  const { id } = useParams()
  const groupId = Number(id)
  const { data: group, isLoading } = useGetGroupQuery(groupId)
  const [selected, setSelected] = useState<number[]>([])

  const [enroll] = useEnrollStudentMutation()
  const [updateStudent] = useUpdateStudentMutation()
  const [deleteStudent] = useDeleteStudentMutation()

  const [addStudentOpen, setAddStudentOpen] = useState(false)
  const [newGroupOpen, setNewGroupOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  /** Ids the pending Change status / Transfer / Delete action applies to. */
  const [statusTargets, setStatusTargets] = useState<number[] | null>(null)
  const [transferTargets, setTransferTargets] = useState<number[] | null>(null)
  const [deleteTargets, setDeleteTargets] = useState<number[] | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const nameOf = (id: number) =>
    group?.students.find((s) => s.id === id)?.full_name ??
    group?.left_course.find((s) => s.id === id)?.full_name ??
    ""

  const exportStudents = () => {
    if (!group) return
    const rows = [
      ["Full name", "Phone", "Father phone", "Account", "Status"],
      ...group.students.map((s) => [
        s.full_name,
        s.phone,
        s.father_phone,
        s.has_account ? "YES" : "NO",
        s.status,
      ]),
    ]
    const csv = rows.map((row) => row.join(",")).join("\n")
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }))
    const link = document.createElement("a")
    link.href = url
    link.download = `${group.name}-students.csv`
    link.click()
    URL.revokeObjectURL(url)
    setToast("File is success exported!")
  }

  const toggle = (studentId: number) =>
    setSelected((prev) =>
      prev.includes(studentId) ? prev.filter((s) => s !== studentId) : [...prev, studentId]
    )

  if (isLoading || !group) {
    return <p className="text-muted-foreground">Loading...</p>
  }

  const allSelected = selected.length === group.students.length && group.students.length > 0

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <Card className="gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/groups" aria-label="Back to groups">
                  <ArrowLeft className="size-5" />
                </Link>
              </Button>
              <div>
                <p className="flex items-center gap-2 text-xl font-bold whitespace-nowrap">
                  {group.name}
                  <span className="size-2.5 rounded-full bg-success" />
                </p>
                <p className="text-sm text-muted-foreground">{group.branch}</p>
              </div>
            </div>
            <div className="flex flex-col items-center whitespace-nowrap">
              <Badge variant="secondary" className="px-3">
                {group.passing_students}/{group.capacity}
              </Badge>
              <span className="mt-1 text-xs text-muted-foreground">Passing students</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="bg-accent text-primary">
              <FolderOpen className="size-4" /> Resources
            </Button>
            <Button variant="outline" className="text-primary">
              <FileText className="size-4" /> Contract
            </Button>
            <Button variant="ghost" size="icon" className="ml-auto" aria-label="Send message">
              <Send className="size-4 text-sky-500" />
            </Button>
          </div>
        </Card>

        <Card className="gap-3">
          <Link
            to={`/groups/${group.id}/journal`}
            className="flex items-center justify-between font-bold hover:text-primary"
          >
            <span className="flex items-center gap-2 text-lg">
              <ClipboardList className="size-5" /> Journal
            </span>
            <ChevronRight className="size-5" />
          </Link>
          <div className="text-sm">
            <p>{group.start_date}</p>
            <p>{group.end_date}</p>
          </div>
        </Card>

        <ScheduleSheet groupId={group.id}>
          <Card className="cursor-pointer gap-3 text-left transition-colors hover:border-primary/50" role="button">
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-2 text-lg">
                <CalendarDays className="size-5" /> Schedule
              </span>
              <ChevronRight className="size-5" />
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground">{group.days}</p>
              <p className="font-semibold">{group.time}</p>
            </div>
          </Card>
        </ScheduleSheet>

        <MentorsSheet mentors={group.mentors}>
          <Card
            className="cursor-pointer gap-3 text-left transition-colors hover:border-primary/50"
            role="button"
          >
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-2 text-lg">
                <User className="size-5" /> Mentors
              </span>
              <ChevronRight className="size-5" />
            </div>
            <div className="text-sm">
              {group.mentors.map((mentor) => (
                <p key={mentor}>{mentor}</p>
              ))}
            </div>
          </Card>
        </MentorsSheet>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button size="lg">
          <Pencil /> Edit
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="text-primary"
          onClick={() => setAddStudentOpen(true)}
        >
          <Plus /> Add student
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="text-primary"
          onClick={() => setNewGroupOpen(true)}
        >
          <LayoutGrid /> New group
        </Button>
        <div className="ml-auto flex items-center gap-3">
          <Button variant="outline" size="lg" className="text-primary" onClick={exportStudents}>
            <Upload /> Export
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-primary"
            onClick={() => setImportOpen(true)}
          >
            <Download /> Import
          </Button>
        </div>
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  aria-label="Select all students"
                  onCheckedChange={(checked) =>
                    setSelected(checked === true ? group.students.map((s) => s.id) : [])
                  }
                />
              </TableHead>
              <TableHead>Full name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {group.students.map((student) => (
              <TableRow key={student.id} data-state={selected.includes(student.id) ? "selected" : undefined}>
                <TableCell>
                  <Checkbox
                    checked={selected.includes(student.id)}
                    aria-label={`Select ${student.full_name}`}
                    onCheckedChange={() => toggle(student.id)}
                  />
                </TableCell>
                <TableCell>
                  <StudentInfoSheet studentId={student.id} fullName={student.full_name}>
                    <button type="button" className="font-medium hover:text-primary">
                      {student.full_name}
                    </button>
                  </StudentInfoSheet>
                </TableCell>
                <TableCell>
                  <PhoneCell
                    phone={student.phone}
                    contacts={[
                      { label: "Student", number: student.phone },
                      { label: "Father", number: student.father_phone },
                    ]}
                  />
                </TableCell>
                <TableCell>{student.has_account ? "YES" : "NO"}</TableCell>
                <TableCell>
                  <Badge variant={student.status === "Active" ? "success" : "secondary"}>
                    {student.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Change status"
                      onClick={() => setStatusTargets([student.id])}
                    >
                      <UserRoundMinus className="size-4 text-destructive" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Transfer student"
                      onClick={() => setTransferTargets([student.id])}
                    >
                      <CornerDownLeft className="size-4 rotate-180 text-primary" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="lg"
          className="text-destructive"
          disabled={!selected.length}
          onClick={() => setStatusTargets(selected)}
        >
          Change status <UserMinus />
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="text-primary"
          disabled={!selected.length}
          onClick={() => setTransferTargets(selected)}
        >
          Transfer <CornerDownLeft className="rotate-180" />
        </Button>
      </div>

      <h2 className="text-2xl font-bold">Left course</h2>
      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {group.left_course.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.full_name}</TableCell>
                <TableCell>{student.phone}</TableCell>
                <TableCell>{student.has_account ? "Yes" : "No"}</TableCell>
                <TableCell className="whitespace-normal">{student.reason}</TableCell>
                <TableCell>
                  <Badge variant="destructive">Left</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete record"
                      onClick={() => setDeleteTargets([student.id])}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Return to group"
                      onClick={() => setStatusTargets([student.id])}
                    >
                      <CornerDownLeft className="size-4 text-primary" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <NewStudentDialog
        groupId={groupId}
        open={addStudentOpen}
        onOpenChange={setAddStudentOpen}
        onDone={setToast}
      />
      <NewGroupDialog open={newGroupOpen} onOpenChange={setNewGroupOpen} onDone={setToast} />
      <ImportDialog open={importOpen} onOpenChange={setImportOpen} onDone={setToast} />

      <ChangeStatusDialog
        open={statusTargets !== null}
        onOpenChange={(o) => !o && setStatusTargets(null)}
        onDone={async (description) => {
          for (const id of statusTargets ?? []) {
            await updateStudent({ id, data: { status: "inactive", description } })
          }
          setSelected([])
          setToast("Status is success changed!")
        }}
      />

      <TransferDialog
        names={(transferTargets ?? []).map(nameOf)}
        open={transferTargets !== null}
        onOpenChange={(o) => !o && setTransferTargets(null)}
        onDone={async (targetGroupId) => {
          for (const id of transferTargets ?? []) {
            await enroll({ student_id: id, group_id: targetGroupId })
          }
          setSelected([])
          setToast("Students are success transferred!")
        }}
      />

      <ConfirmDialog
        open={deleteTargets !== null}
        onOpenChange={(o) => !o && setDeleteTargets(null)}
        title="Do you really want to delete student (-s)?"
        confirmLabel="Yes"
        destructive={false}
        onConfirm={async () => {
          for (const id of deleteTargets ?? []) await deleteStudent(id)
          setToast("Student is success deleted!")
        }}
      />

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
