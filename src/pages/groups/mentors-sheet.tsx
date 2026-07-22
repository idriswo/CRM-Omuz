import { useState, type ReactNode } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Toast } from "@/components/shared/toast"
import { employees } from "@/pages/employees/mock-data"

type MentorStatus = "Teaching" | "Support"

interface GroupMentor {
  id: number
  name: string
  status: MentorStatus
  date: string
}

const mentorOptions = employees.map((e) => e.fullName)

function today() {
  return new Date().toLocaleDateString("ru-RU").replace(/\//g, ".")
}

/** Radio row used for the Teaching / Support choice. */
function StatusRadio({
  value,
  onChange,
  name,
}: {
  value: MentorStatus
  onChange: (value: MentorStatus) => void
  name: string
}) {
  return (
    <div className="flex items-center gap-5">
      {(["Teaching", "Support"] as MentorStatus[]).map((status) => (
        <label key={status} className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="radio"
            name={name}
            className="size-4 accent-primary"
            checked={value === status}
            onChange={() => onChange(status)}
          />
          {status}
        </label>
      ))}
    </div>
  )
}

export function MentorsSheet({
  mentors: initial,
  children,
}: {
  /** Mentor names already assigned to the group. */
  mentors: string[]
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [mentors, setMentors] = useState<GroupMentor[]>(() =>
    initial.map((name, i) => ({ id: i + 1, name, status: "Teaching", date: "23.08.2022" }))
  )

  const [newName, setNewName] = useState("")
  const [newStatus, setNewStatus] = useState<MentorStatus>("Teaching")
  const [editing, setEditing] = useState<GroupMentor | null>(null)
  const [pendingDelete, setPendingDelete] = useState<GroupMentor | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const addMentor = () => {
    if (!newName) return
    setMentors((prev) => [
      ...prev,
      { id: Date.now(), name: newName, status: newStatus, date: today() },
    ])
    setNewName("")
    setNewStatus("Teaching")
    setToast("Mentor is success added!")
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent title="Mentors" className="max-w-md">
          <Card className="gap-4">
            <h3 className="font-bold">New mentor</h3>
            <Select value={newName} onValueChange={setNewName}>
              <SelectTrigger className="h-11 w-full">
                <SelectValue placeholder="Mentor" />
              </SelectTrigger>
              <SelectContent>
                {mentorOptions.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <StatusRadio name="new-mentor-status" value={newStatus} onChange={setNewStatus} />
            </div>
            <Button className="ml-auto" disabled={!newName} onClick={addMentor}>
              <Plus /> Add new
            </Button>
          </Card>

          <div className="flex flex-col gap-4">
            {mentors.map((mentor) => (
              <Card key={mentor.id} className="gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-2">
                    <p className="font-bold">{mentor.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant={mentor.status === "Teaching" ? "secondary" : "outline"}>
                        {mentor.status}
                      </Badge>
                      <span>•</span>
                      <span>{mentor.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Edit mentor"
                      onClick={() => setEditing(mentor)}
                    >
                      <Pencil className="size-4 text-primary" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Delete mentor"
                      onClick={() => setPendingDelete(mentor)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-sm gap-5">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit mentor</DialogTitle>
          </DialogHeader>
          {editing && (
            <>
              <Select
                value={editing.name}
                onValueChange={(name) => setEditing({ ...editing, name })}
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Mentor" />
                </SelectTrigger>
                <SelectContent>
                  {mentorOptions.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <StatusRadio
                  name="edit-mentor-status"
                  value={editing.status}
                  onChange={(status) => setEditing({ ...editing, status })}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => {
                    setMentors((prev) =>
                      prev.map((m) => (m.id === editing.id ? editing : m))
                    )
                    setEditing(null)
                    setToast("Mentor is success change!")
                  }}
                >
                  SAVE
                </Button>
                <Button variant="outline" className="text-primary" onClick={() => setEditing(null)}>
                  CANCEL
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(o) => !o && setPendingDelete(null)}
        title="Do you really want to delete mentor?"
        onConfirm={() => {
          setMentors((prev) => prev.filter((m) => m.id !== pendingDelete?.id))
          setToast("Mentor is success deleted!")
        }}
      />

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  )
}
