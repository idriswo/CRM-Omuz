import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, FileWarning } from "lucide-react"

import { Card } from "@/components/ui/card"
import { CourseLogo } from "./course-logo"
import { useGetCourseQuery, useGetGroupsQuery } from "@/store/services"

/**
 * The API has no syllabus/lesson resource (no `Lesson` model, no
 * `/courses/:id/syllabus` route), so this page shows the real course record and
 * its real groups, and states plainly that the lesson list needs new endpoints.
 */
export function CourseSyllabusPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const courseId = Number(id)

  const { data: course, isLoading, isError } = useGetCourseQuery(courseId, { skip: !courseId })
  const { data: groups } = useGetGroupsQuery({ course_id: courseId, limit: 100 }, { skip: !courseId })

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
          <h1 className="text-3xl font-bold">
            {course ? `${course.name} syllabus` : "Course syllabus"}
          </h1>
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading course…</p>}
      {isError && <p className="text-sm text-destructive">Could not load this course.</p>}

      {course && (
        <Card className="gap-4">
          <div className="flex items-start gap-4">
            <CourseLogo name={course.name} className="size-14 text-lg" />
            <div className="min-w-0">
              <h2 className="text-xl font-bold">{course.name}</h2>
              <p className="text-sm text-muted-foreground">
                {course.duration}
                <span className="mx-2 text-border">|</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {course.price} somoni
                </span>
              </p>
            </div>
          </div>
          {course.description && (
            <p className="text-sm text-muted-foreground">{course.description}</p>
          )}
        </Card>
      )}

      <Card className="gap-4">
        <h2 className="text-lg font-bold">Groups on this course</h2>
        {(groups?.data ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">No groups yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {(groups?.data ?? []).map((group) => (
              <button
                key={group.id}
                onClick={() => navigate(`/groups/${group.id}`)}
                className="flex items-center justify-between py-3 text-left hover:text-primary"
              >
                <span className="font-medium">{group.name}</span>
                <span className="text-sm text-muted-foreground">
                  {group.duration} · {group.status}
                </span>
              </button>
            ))}
          </div>
        )}
      </Card>

      <Card className="flex-row items-start gap-4">
        <FileWarning className="size-6 shrink-0 text-orange-500" />
        <div>
          <h2 className="font-bold">Lesson list is not available yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The backend has no syllabus resource. To render the lesson cards from this design it
            needs <code>GET/POST /courses/:id/syllabus</code> and{" "}
            <code>PUT/DELETE /courses/:id/syllabus/:lessonId</code>, with{" "}
            <code>{"{ id, title, description, types[] }"}</code> per lesson.
          </p>
        </div>
      </Card>
    </div>
  )
}
