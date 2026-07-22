import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { LayoutGrid, List, Plus, Search, SquarePen, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CourseLogo } from "./course-logo"
import { CourseDialog } from "./course-dialog"
import {
  useDeleteCourseMutation,
  useGetCoursesQuery,
  useGetGroupsQuery,
  type Course,
} from "@/store/services"

type View = "grid" | "list"

export function CoursesPage() {
  const navigate = useNavigate()
  const [view, setView] = useState<View>("grid")
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Course | null>(null)

  const { data, isLoading, isError } = useGetCoursesQuery({ search: search || undefined, limit: 100 })
  /** `GET /courses` has no group count, so it is derived from the real groups list. */
  const { data: groups } = useGetGroupsQuery({ limit: 200 })
  const [deleteCourse, { isLoading: deleting }] = useDeleteCourseMutation()

  const groupsPerCourse = useMemo(() => {
    const counts = new Map<number, number>()
    for (const group of groups?.data ?? []) {
      if (group.course_id == null) continue
      counts.set(group.course_id, (counts.get(group.course_id) ?? 0) + 1)
    }
    return counts
  }, [groups])

  const courses = data?.data ?? []

  const openCreate = () => {
    setEditing(null)
    setDialogOpen(true)
  }

  const openEdit = (course: Course) => {
    setEditing(course)
    setDialogOpen(true)
  }

  const handleDelete = async (course: Course) => {
    if (!confirm(`Delete "${course.name}"?`)) return
    await deleteCourse(course.id)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Courses</h1>
        <Button size="lg" onClick={openCreate}>
          <Plus /> ADD NEW
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search course"
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="ml-auto flex items-center gap-1 rounded-lg bg-secondary p-1">
          {(
            [
              ["grid", LayoutGrid],
              ["list", List],
            ] as const
          ).map(([key, Icon]) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              aria-label={`${key} view`}
              className={cn(
                "flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors",
                view === key && "bg-primary text-primary-foreground"
              )}
            >
              <Icon className="size-4" />
            </button>
          ))}
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading courses…</p>}
      {isError && <p className="text-sm text-destructive">Could not load courses.</p>}
      {!isLoading && !isError && courses.length === 0 && (
        <p className="text-sm text-muted-foreground">No courses yet.</p>
      )}

      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              groups={groupsPerCourse.get(c.id) ?? 0}
              onOpen={() => navigate(`/courses/${c.id}/syllabus`)}
              onEdit={() => openEdit(c)}
              onDelete={() => handleDelete(c)}
              disabled={deleting}
            />
          ))}
        </div>
      ) : (
        <CoursesTable
          courses={courses}
          groupsPerCourse={groupsPerCourse}
          onOpen={(id) => navigate(`/courses/${id}/syllabus`)}
          onEdit={openEdit}
          onDelete={handleDelete}
          disabled={deleting}
        />
      )}

      <CourseDialog open={dialogOpen} onOpenChange={setDialogOpen} course={editing} />
    </div>
  )
}

function CourseCard({
  course,
  groups,
  onOpen,
  onEdit,
  onDelete,
  disabled,
}: {
  course: Course
  groups: number
  onOpen: () => void
  onEdit: () => void
  onDelete: () => void
  disabled: boolean
}) {
  return (
    <Card
      onClick={onOpen}
      className="cursor-pointer gap-0 p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-xl font-bold">{course.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Groups: <span className="font-semibold text-foreground">{groups}</span>
            <span className="mx-2 text-border">|</span>
            {course.duration}
          </p>
        </div>
        <CourseLogo name={course.name} className="size-14 text-lg" />
      </div>

      <hr className="my-5 border-border" />

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">
          Fee:{" "}
          <span className="font-bold text-green-600 dark:text-green-400">
            {course.price} somoni
          </span>
        </p>
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" aria-label="Edit course" onClick={onEdit}>
            <SquarePen className="size-4 text-primary" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete course"
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

function CoursesTable({
  courses: rows,
  groupsPerCourse,
  onOpen,
  onEdit,
  onDelete,
  disabled,
}: {
  courses: Course[]
  groupsPerCourse: Map<number, number>
  onOpen: (id: number) => void
  onEdit: (course: Course) => void
  onDelete: (course: Course) => void
  disabled: boolean
}) {
  return (
    <Card className="p-0">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/60">
            <TableHead>LOGO</TableHead>
            <TableHead>TITLE</TableHead>
            <TableHead>FEE</TableHead>
            <TableHead>GROUPS</TableHead>
            <TableHead>DURATION</TableHead>
            <TableHead className="text-right">ACTION</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((c) => (
            <TableRow key={c.id} className="cursor-pointer" onClick={() => onOpen(c.id)}>
              <TableCell>
                <CourseLogo name={c.name} />
              </TableCell>
              <TableCell className="font-medium">{c.name}</TableCell>
              <TableCell>{c.price}</TableCell>
              <TableCell>{groupsPerCourse.get(c.id) ?? 0}</TableCell>
              <TableCell>{c.duration}</TableCell>
              <TableCell className="text-right">
                <div
                  className="flex items-center justify-end gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => onEdit(c)}>
                    <SquarePen className="size-4 text-primary" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete"
                    onClick={() => onDelete(c)}
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
