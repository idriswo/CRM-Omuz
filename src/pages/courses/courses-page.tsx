import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { LayoutGrid, List, Plus, Search, SquarePen } from "lucide-react"

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
import { courses, type Course } from "./mock-data"
import { JsLogo } from "./course-logo"
import { usePersistedState } from "@/hooks/use-persisted-state"

type View = "grid" | "list"

export function CoursesPage() {
  const navigate = useNavigate()
  const [view, setView] = usePersistedState<View>("courses:view", "grid")
  const [search, setSearch] = useState("")

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Courses</h1>
        <Button size="lg">
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

      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => (
            <CourseCard key={c.id} course={c} onOpen={() => navigate(`/courses/${c.id}/syllabus`)} />
          ))}
        </div>
      ) : (
        <CoursesTable courses={filtered} onOpen={(id) => navigate(`/courses/${id}/syllabus`)} />
      )}
    </div>
  )
}

function CourseCard({ course, onOpen }: { course: Course; onOpen: () => void }) {
  return (
    <Card
      onClick={onOpen}
      className="cursor-pointer gap-0 p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold">{course.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Groups: <span className="font-semibold text-foreground">{course.groups}</span>
          </p>
        </div>
        <JsLogo className="size-14 text-lg" />
      </div>

      <hr className="my-5 border-border" />

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">
          Fee:{" "}
          <span className="font-bold text-green-600 dark:text-green-400">
            {course.fee} somoni
          </span>
        </p>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Edit course"
          onClick={(e) => e.stopPropagation()}
        >
          <SquarePen className="size-4 text-primary" />
        </Button>
      </div>
    </Card>
  )
}

function CoursesTable({
  courses: rows,
  onOpen,
}: {
  courses: Course[]
  onOpen: (id: number) => void
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
                <JsLogo className="size-10 text-sm" />
              </TableCell>
              <TableCell className="font-medium">{c.title}</TableCell>
              <TableCell>{c.fee}</TableCell>
              <TableCell>{c.groups}</TableCell>
              <TableCell>{c.duration}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Edit"
                  onClick={(e) => e.stopPropagation()}
                >
                  <SquarePen className="size-4 text-primary" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
