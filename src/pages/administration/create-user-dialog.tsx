import { useState, type FormEvent } from "react"
import { CheckCircle2, Copy } from "lucide-react"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { apiErrorMessage } from "@/lib/api-error"
import {
  useCreateUserMutation,
  useGetBranchesQuery,
  useGetEmployeesQuery,
  useGetRolesQuery,
  type CreateUserResponse,
} from "@/store/services"

export function CreateUserDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add user</DialogTitle>
        </DialogHeader>
        <CreateUserForm onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

function CreateUserForm({ onDone }: { onDone: () => void }) {
  const { data: roles } = useGetRolesQuery()
  const { data: branches } = useGetBranchesQuery()
  const { data: employees } = useGetEmployeesQuery()
  const [createUser, { isLoading }] = useCreateUserMutation()

  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [roleId, setRoleId] = useState("")
  const [branchId, setBranchId] = useState("")
  const [employeeId, setEmployeeId] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [created, setCreated] = useState<CreateUserResponse | null>(null)

  const mentorRoleId = roles?.data.find((r) => r.name === "mentor")?.id
  const isMentor = roleId !== "" && mentorRoleId !== undefined && Number(roleId) === mentorRoleId

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await createUser({
        email: email.trim(),
        full_name: fullName.trim(),
        role_id: Number(roleId),
        branch_id: branchId ? Number(branchId) : undefined,
        employee_id: isMentor && employeeId ? Number(employeeId) : undefined,
      }).unwrap()

      if (res.email_sent) {
        onDone()
      } else {
        // No inbox got the password — show it once so staff can hand it over manually.
        setCreated(res)
      }
    } catch (err) {
      setError(apiErrorMessage(err, { conflict: "This email is already registered." }))
    }
  }

  if (created?.login_credentials) {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
          <p className="font-semibold">Could not email the credentials.</p>
          <p className="text-muted-foreground">Share these with the new user yourself.</p>
        </div>
        <div className="flex flex-col gap-2 rounded-lg border border-border p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{created.login_credentials.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Password</span>
            <span className="flex items-center gap-2 font-mono font-medium">
              {created.login_credentials.password}
              <button
                type="button"
                aria-label="Copy password"
                onClick={() => navigator.clipboard.writeText(created.login_credentials!.password)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Copy className="size-3.5" />
              </button>
            </span>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onDone}>
            <CheckCircle2 /> Done
          </Button>
        </DialogFooter>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="user-email">Email</Label>
        <Input
          id="user-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="user-name">Full name</Label>
        <Input id="user-name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Role</Label>
        <Select value={roleId} onValueChange={setRoleId}>
          <SelectTrigger className="h-11 w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {roles?.data.map((role) => (
              <SelectItem key={role.id} value={String(role.id)}>
                {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Branch</Label>
        <Select value={branchId} onValueChange={setBranchId}>
          <SelectTrigger className="h-11 w-full">
            <SelectValue placeholder="Select a branch" />
          </SelectTrigger>
          <SelectContent>
            {branches?.data.map((branch) => (
              <SelectItem key={branch.id} value={String(branch.id)}>
                {branch.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isMentor && (
        <div className="flex flex-col gap-1.5">
          <Label>Employee record</Label>
          <Select value={employeeId} onValueChange={setEmployeeId}>
            <SelectTrigger className="h-11 w-full">
              <SelectValue placeholder="Link to their employee record" />
            </SelectTrigger>
            <SelectContent>
              {employees?.data.map((employee) => (
                <SelectItem key={employee.id} value={String(employee.id)}>
                  {employee.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Links this account to their Employee record, so they see their own timetable.
          </p>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || !roleId}>
          {isLoading ? "Creating…" : "Create"}
        </Button>
      </DialogFooter>
    </form>
  )
}
