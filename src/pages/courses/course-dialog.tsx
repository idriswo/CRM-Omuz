import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCreateCourseMutation, useUpdateCourseMutation, type Course } from "@/store/services"

/** Create / edit dialog backed by `POST /courses` and `PUT /courses/:id`.
 * Only the four fields the backend persists are exposed. */
export function CourseDialog({
  open,
  onOpenChange,
  course,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  course?: Course | null
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{course ? "Edit course" : "Add new course"}</DialogTitle>
        </DialogHeader>
        {/* Remount per target so the fields start from that course's values. */}
        <CourseForm key={course?.id ?? "new"} course={course} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

function CourseForm({ course, onDone }: { course?: Course | null; onDone: () => void }) {
  const [createCourse, { isLoading: creating }] = useCreateCourseMutation()
  const [updateCourse, { isLoading: updating }] = useUpdateCourseMutation()

  const [name, setName] = useState(course?.name ?? "")
  const [description, setDescription] = useState(course?.description ?? "")
  const [duration, setDuration] = useState(course?.duration ?? "")
  const [price, setPrice] = useState(course?.price == null ? "" : String(course.price))
  const [failed, setFailed] = useState(false)

  const saving = creating || updating

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFailed(false)
    const body = {
      name: name.trim(),
      description: description.trim() || null,
      duration: duration.trim(),
      price: Number(price) || 0,
    }
    try {
      if (course) await updateCourse({ id: course.id, data: body }).unwrap()
      else await createCourse(body).unwrap()
      onDone()
    } catch {
      setFailed(true)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="course-name">Name</Label>
        <Input
          id="course-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="JavaScript"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="course-duration">Duration</Label>
        <Input
          id="course-duration"
          required
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="3 months"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="course-price">Price (somoni)</Label>
        <Input
          id="course-price"
          type="number"
          min={0}
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="course-description">Description</Label>
        <Textarea
          id="course-description"
          value={description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {failed && <p className="text-sm text-destructive">Could not save the course.</p>}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </DialogFooter>
    </form>
  )
}
