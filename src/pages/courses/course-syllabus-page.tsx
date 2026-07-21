import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, Search, SquarePen, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { syllabus, type Lesson, type LessonType } from "./mock-data"

const typeStyles: Record<LessonType, string> = {
  Lecture: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300",
  Practice: "bg-orange-100 text-orange-500 dark:bg-orange-500/15 dark:text-orange-300",
  Exam: "bg-red-100 text-red-500 dark:bg-red-500/15 dark:text-red-300",
}

export function CourseSyllabusPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")

  const filtered = syllabus.filter((l) =>
    l.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/courses")}
            className="rounded-md p-1 hover:bg-accent"
            aria-label="Back"
          >
            <ArrowLeft className="size-6" />
          </button>
          <h1 className="text-3xl font-bold">JavaScript syllabus</h1>
        </div>
        <Button size="lg">
          <Plus /> ADD NEW
        </Button>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search lesson"
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  )
}

function LessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <Card className="gap-0 p-5">
      <h3 className="text-lg font-bold">{lesson.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{lesson.description}</p>

      <hr className="my-5 border-border" />

      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {lesson.types.map((t) => (
            <span
              key={t}
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                typeStyles[t]
              )}
            >
              {t}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Edit">
            <SquarePen className="size-4 text-primary" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Delete">
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
