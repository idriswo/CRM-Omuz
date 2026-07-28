import { useState, type ReactNode } from "react"

import { apiErrorMessage } from "@/lib/api-error"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useCreateGroupMutation,
  useGetBranchesQuery,
  useGetCoursesQuery,
  useUpdateGroupMutation,
  type Group,
  type GroupBody,
  type GroupStatus,
} from "@/store/services"

const emptyForm: GroupBody = {
  name: "",
  description: "",
  duration: "",
  required_students: 0,
  duration_type: "",
  start_date: "",
  end_date: "",
  status: "",
  format: "",
  course_id: null,
  branch_id: null,
  telegram_link: "",
}

const durationTypes = ["Day", "Week", "Month", "Year"]
const statuses: GroupStatus[] = ["Started", "Pending", "Finished"]
const formats = ["Offline", "Online", "Hybrid"]

/** Outlined field whose label floats onto the border once the field is filled. */
function Field({
  label,
  filled,
  className,
  children,
}: {
  label: string
  filled: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn("relative", className)}>
      {filled && (
        <span className="absolute -top-2 left-3 z-10 bg-card px-1 text-xs text-muted-foreground">
          {label}
        </span>
      )}
      {children}
    </div>
  )
}

/** Select styled like the outlined inputs, showing `placeholder` while empty. */
function FormSelect({
  label,
  value,
  options,
  onChange,
  className,
  empty,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  className?: string
  /** Shown inside the menu when there is nothing to pick, so an empty list
   * doesn't look like a broken dropdown. */
  empty?: string
}) {
  return (
    <Field label={label} filled={value !== ""} className={className}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 w-full">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {options.length === 0 && empty ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">{empty}</p>
          ) : (
            options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </Field>
  )
}

export function GroupFormDialog({
  group,
  open,
  onOpenChange,
}: {
  /** Omit to create a new group, pass a group to edit it. */
  group?: Group | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const isEdit = Boolean(group)
  const { data: branches } = useGetBranchesQuery()
  const { data: courses } = useGetCoursesQuery({ limit: 200 })
  const [createGroup, { isLoading: isCreating }] = useCreateGroupMutation()
  const [updateGroup, { isLoading: isUpdating }] = useUpdateGroupMutation()

  const [form, setForm] = useState<GroupBody>(emptyForm)
  const [loadedId, setLoadedId] = useState<number | null>(null)
  const [error, setError] = useState("")

  // Seed the form from the edited group, and clear it on close (adjusting state during render).
  const seedId = open ? (group?.id ?? 0) : null
  if (seedId !== loadedId) {
    setLoadedId(seedId)
    setError("")
    setForm(
      open && group
        ? {
            ...emptyForm,
            name: group.name,
            duration: group.duration.replace(/\D+/g, ""),
            duration_type: durationTypes.find((t) => group.duration.includes(t.toLowerCase())) ?? "",
            required_students: group.required_students,
            start_date: group.start_date,
            end_date: group.end_date,
            status: group.status,
            course_id: courses?.data.find((c) => c.name === group.course)?.id ?? null,
            branch_id: branches?.data.find((b) => b.title === group.branch)?.id ?? null,
          }
        : emptyForm
    )
  }

  const set = <K extends keyof GroupBody>(key: K, value: GroupBody[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  // The backend rejects the group unless all three are set (`name, course_id ва
  // branch_id ҳатмист`), so block the request instead of failing behind the scenes.
  const missing = !form.name.trim() || !form.course_id || !form.branch_id

  const submit = async () => {
    if (missing) {
      setError("Group name, course and branch are required.")
      return
    }
    setError("")
    try {
      if (group) await updateGroup({ id: group.id, data: form }).unwrap()
      else await createGroup(form).unwrap()
      onOpenChange(false)
    } catch (err) {
      setError(apiErrorMessage(err, { fallback: "Could not save the group." }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl gap-5">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEdit ? "Edit group" : "New group"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <Field label="Group name *" filled={form.name !== ""}>
            <Input
              placeholder="Group name *"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </Field>

          <Field label="Description" filled={Boolean(form.description)}>
            <Input
              placeholder="Description"
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Duration" filled={form.duration !== ""}>
              <Input
                placeholder="Duration"
                value={form.duration}
                onChange={(e) => set("duration", e.target.value)}
              />
            </Field>
            <Field label="Required students" filled={form.required_students > 0}>
              <Input
                type="number"
                min={0}
                placeholder="Required students"
                value={form.required_students || ""}
                onChange={(e) => set("required_students", Number(e.target.value))}
              />
            </Field>
            <FormSelect
              label="Duration type"
              value={form.duration_type ?? ""}
              onChange={(v) => set("duration_type", v)}
              options={durationTypes.map((t) => ({ value: t, label: t }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Start" filled>
              <Input
                type="date"
                value={form.start_date}
                onChange={(e) => set("start_date", e.target.value)}
              />
            </Field>
            <Field label="End" filled>
              <Input
                type="date"
                value={form.end_date}
                onChange={(e) => set("end_date", e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormSelect
              label="Status"
              value={form.status ?? ""}
              onChange={(v) => set("status", v as GroupStatus)}
              options={statuses.map((s) => ({ value: s, label: s }))}
            />
            <FormSelect
              label="Course format"
              value={form.format ?? ""}
              onChange={(v) => set("format", v)}
              options={formats.map((f) => ({ value: f, label: f }))}
            />
            <FormSelect
              label="Course *"
              value={form.course_id ? String(form.course_id) : ""}
              onChange={(v) => set("course_id", Number(v))}
              options={(courses?.data ?? []).map((c) => ({ value: String(c.id), label: c.name }))}
              empty="No courses yet — create one under Courses first."
            />
          </div>

          <FormSelect
            label="Branch *"
            value={form.branch_id ? String(form.branch_id) : ""}
            onChange={(v) => set("branch_id", Number(v))}
            options={(branches?.data ?? []).map((b) => ({
              value: String(b.id),
              label: b.title,
            }))}
            empty="No branches yet — create one under Branches first."
          />

          <Field label="Telegram link" filled={Boolean(form.telegram_link)}>
            <Input
              placeholder="Telegram link"
              value={form.telegram_link ?? ""}
              onChange={(e) => set("telegram_link", e.target.value)}
            />
          </Field>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end gap-3">
          <Button onClick={submit} disabled={isCreating || isUpdating}>
            {isEdit ? "SAVE" : "ADD"}
          </Button>
          <Button variant="outline" className="text-primary" onClick={() => onOpenChange(false)}>
            CANCEL
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
