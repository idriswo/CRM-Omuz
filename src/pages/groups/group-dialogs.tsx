import { useRef, useState } from "react"
import { FileUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { SearchInput } from "@/components/shared/search-input"
import { apiErrorMessage } from "@/lib/api-error"
import {
  useCreateGroupMutation,
  useEnrollStudentMutation,
  useGetBranchesQuery,
  useGetCoursesQuery,
  useGetGroupsQuery,
  useGetStudentsQuery,
} from "@/store/services"

/** Pick students from the whole list and add them to the group. */
export function NewStudentDialog({
  groupId,
  open,
  onOpenChange,
  onDone,
}: {
  groupId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onDone: (message: string) => void
}) {
  const [search, setSearch] = useState("")
  const [picked, setPicked] = useState<number[]>([])
  const [error, setError] = useState("")
  const { data } = useGetStudentsQuery({ search, limit: 30 }, { skip: !open })
  const [enroll, { isLoading }] = useEnrollStudentMutation()

  const toggle = (id: number) =>
    setPicked((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-5">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">New student</DialogTitle>
        </DialogHeader>

        <SearchInput value={search} onChange={setSearch} placeholder="Search by name" />

        <div className="flex max-h-80 flex-col gap-2 overflow-y-auto">
          {(data?.data ?? []).map((student) => (
            <label
              key={student.id}
              className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border px-4 py-3"
            >
              <span>
                <span className="block font-medium">{student.full_name}</span>
                <span className="block text-xs text-muted-foreground">{student.phone}</span>
              </span>
              <Checkbox
                checked={picked.includes(student.id)}
                onCheckedChange={() => toggle(student.id)}
                aria-label={`Select ${student.full_name}`}
              />
            </label>
          ))}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button
            disabled={!picked.length || isLoading}
            onClick={async () => {
              setError("")
              try {
                for (const id of picked) {
                  await enroll({ student_id: id, group_id: groupId }).unwrap()
                }
              } catch (err) {
                setError(apiErrorMessage(err, { fallback: "Could not add the students." }))
                return
              }
              setPicked([])
              onOpenChange(false)
              onDone("Students are success added!")
            }}
          >
            Add
          </Button>
          <Button variant="outline" className="text-primary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/** Quick group creation: name, course, branch and the start/end dates.
 * Course and branch are here because `POST /groups` rejects the request without
 * them (`name, course_id ва branch_id ҳатмист`). */
export function NewGroupDialog({
  open,
  onOpenChange,
  onDone,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDone: (message: string) => void
}) {
  const [name, setName] = useState("")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [courseId, setCourseId] = useState("")
  const [branchId, setBranchId] = useState("")
  const [error, setError] = useState("")
  const [createGroup, { isLoading }] = useCreateGroupMutation()
  const { data: courses } = useGetCoursesQuery({ limit: 200 }, { skip: !open })
  const { data: branches } = useGetBranchesQuery(undefined, { skip: !open })

  const submit = async () => {
    setError("")
    try {
      await createGroup({
        name: name.trim(),
        start_date: start,
        end_date: end,
        duration: "",
        required_students: 0,
        course_id: Number(courseId),
        branch_id: Number(branchId),
      }).unwrap()
      setName("")
      setStart("")
      setEnd("")
      setCourseId("")
      setBranchId("")
      onOpenChange(false)
      onDone("Group is success created!")
    } catch (err) {
      setError(apiErrorMessage(err, { fallback: "Could not create the group." }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-5">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">New group</DialogTitle>
        </DialogHeader>

        <Input placeholder="Group name" value={name} onChange={(e) => setName(e.target.value)} />

        <Select value={courseId} onValueChange={setCourseId}>
          <SelectTrigger className="h-11 w-full">
            <SelectValue placeholder="Course" />
          </SelectTrigger>
          <SelectContent>
            {(courses?.data ?? []).length === 0 ? (
              <p className="px-3 py-2 text-sm text-muted-foreground">
                No courses yet — create one under Courses first.
              </p>
            ) : (
              (courses?.data ?? []).map((course) => (
                <SelectItem key={course.id} value={String(course.id)}>
                  {course.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        <Select value={branchId} onValueChange={setBranchId}>
          <SelectTrigger className="h-11 w-full">
            <SelectValue placeholder="Branch" />
          </SelectTrigger>
          <SelectContent>
            {(branches?.data ?? []).length === 0 ? (
              <p className="px-3 py-2 text-sm text-muted-foreground">
                No branches yet — create one under Branches first.
              </p>
            ) : (
              (branches?.data ?? []).map((branch) => (
                <SelectItem key={branch.id} value={String(branch.id)}>
                  {branch.title}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        <div className="grid grid-cols-2 gap-4">
          <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button disabled={!name.trim() || !courseId || !branchId || isLoading} onClick={submit}>
            Create
          </Button>
          <Button variant="outline" className="text-primary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/** File picker used by the Import action. */
export function ImportDialog({
  open,
  onOpenChange,
  onDone,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDone: (message: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-5">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Import</DialogTitle>
        </DialogHeader>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            setFile(e.dataTransfer.files[0] ?? null)
          }}
          className="flex items-center gap-4 rounded-xl border border-dashed border-input px-5 py-6 text-left transition-colors hover:border-primary"
        >
          <FileUp className="size-9 text-muted-foreground" />
          <span>
            <span className="block font-semibold">{file ? file.name : "Select file"}</span>
            <span className="block text-sm text-muted-foreground">
              Click or drag file to this area to upload
            </span>
          </span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xls,.xlsx"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        <DialogFooter>
          <Button
            disabled={!file}
            onClick={() => {
              setFile(null)
              onOpenChange(false)
              onDone("File is success imported!")
            }}
          >
            Import
          </Button>
          <Button variant="outline" className="text-primary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/** Move the selected students into another group. */
export function TransferDialog({
  names,
  open,
  onOpenChange,
  onDone,
}: {
  /** Students being transferred, shown above the group picker. */
  names: string[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onDone: (groupId: number) => void
}) {
  const [groupId, setGroupId] = useState("")
  const { data } = useGetGroupsQuery({ limit: 50 }, { skip: !open })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-5">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Transfer to another group</DialogTitle>
        </DialogHeader>

        {names.length > 0 && <p className="text-sm">{names.join(" / ")}</p>}

        <Select value={groupId} onValueChange={setGroupId}>
          <SelectTrigger className="h-11 w-full">
            <SelectValue placeholder="Group" />
          </SelectTrigger>
          <SelectContent>
            {(data?.data ?? []).map((group) => (
              <SelectItem key={group.id} value={String(group.id)}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DialogFooter>
          <Button
            disabled={!groupId}
            onClick={() => {
              onDone(Number(groupId))
              setGroupId("")
              onOpenChange(false)
            }}
          >
            Done
          </Button>
          <Button variant="outline" className="text-primary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/** Status change asks for a short reason before it is applied. */
export function ChangeStatusDialog({
  open,
  onOpenChange,
  onDone,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDone: (description: string) => void
}) {
  const [description, setDescription] = useState("")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-5">
        <DialogHeader>
          <DialogTitle className="pr-6 text-base font-semibold">
            Do you really want to change status?
          </DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <DialogFooter>
          <Button
            onClick={() => {
              onDone(description)
              setDescription("")
              onOpenChange(false)
            }}
          >
            Yes
          </Button>
          <Button variant="outline" className="text-primary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
