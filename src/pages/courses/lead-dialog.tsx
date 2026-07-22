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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useCreateLeadMutation,
  useGetCoursesQuery,
  useUpdateLeadMutation,
  type Lead,
} from "@/store/services"

const NO_COURSE = "none"

/** Create / edit dialog backed by `POST /leads` and `PUT /leads/:id`. */
export function LeadDialog({
  open,
  onOpenChange,
  lead,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead?: Lead | null
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{lead ? "Edit lead" : "Add new lead"}</DialogTitle>
        </DialogHeader>
        {/* Remount per target so the fields start from that lead's values. */}
        <LeadForm key={lead?.id ?? "new"} lead={lead} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

function LeadForm({ lead, onDone }: { lead?: Lead | null; onDone: () => void }) {
  const { data: courses } = useGetCoursesQuery({ limit: 100 })
  const [createLead, { isLoading: creating }] = useCreateLeadMutation()
  const [updateLead, { isLoading: updating }] = useUpdateLeadMutation()

  const [fullName, setFullName] = useState(lead?.full_name ?? "")
  const [phone, setPhone] = useState(lead?.phone ?? "")
  const [lessonTime, setLessonTime] = useState(lead?.lesson_time ?? "")
  const [courseId, setCourseId] = useState(
    lead?.course_id == null ? NO_COURSE : String(lead.course_id)
  )
  const [utmSource, setUtmSource] = useState(lead?.utm_source ?? "")
  const [occupation, setOccupation] = useState(lead?.occupation ?? "")
  const [notes, setNotes] = useState(lead?.notes ?? "")
  const [failed, setFailed] = useState(false)

  const saving = creating || updating

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFailed(false)
    const body = {
      full_name: fullName.trim(),
      phone: phone.trim(),
      lesson_time: lessonTime.trim() || null,
      course_id: courseId === NO_COURSE ? null : Number(courseId),
      utm_source: utmSource.trim() || null,
      occupation: occupation.trim() || null,
      notes: notes.trim() || null,
    }
    try {
      if (lead) await updateLead({ id: lead.id, data: body }).unwrap()
      else await createLead(body).unwrap()
      onDone()
    } catch {
      setFailed(true)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lead-name">Full name</Label>
          <Input
            id="lead-name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lead-phone">Phone</Label>
          <Input id="lead-phone" required value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lead-time">Lesson time</Label>
          <Input
            id="lead-time"
            value={lessonTime ?? ""}
            onChange={(e) => setLessonTime(e.target.value)}
            placeholder="16:00"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Course</Label>
          <Select value={courseId} onValueChange={setCourseId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_COURSE}>No course</SelectItem>
              {(courses?.data ?? []).map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lead-utm">UTM source</Label>
          <Input
            id="lead-utm"
            value={utmSource ?? ""}
            onChange={(e) => setUtmSource(e.target.value)}
            placeholder="Instagram"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lead-occupation">Occupation</Label>
          <Input
            id="lead-occupation"
            value={occupation ?? ""}
            onChange={(e) => setOccupation(e.target.value)}
            placeholder="Pupil"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="lead-notes">Notes</Label>
        <Textarea
          id="lead-notes"
          value={notes ?? ""}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {failed && <p className="text-sm text-destructive">Could not save the lead.</p>}

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
