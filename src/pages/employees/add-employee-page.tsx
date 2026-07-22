import { useState, type FormEvent, type ReactNode } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useCreateEmployeeMutation,
  useGetBranchesQuery,
  useGetEmployeeQuery,
  useGetEmployeesQuery,
  useUpdateEmployeeMutation,
  type Employee,
} from "@/store/services"
import { positionLabel } from "./employee-format"

const NO_BRANCH = "none"
const CUSTOM = "__custom"

interface FormState {
  first_name: string
  last_name: string
  phone: string
  email: string
  position: string
  experience: string
  branch_id: string
}

function initialState(employee?: Employee): FormState {
  return {
    first_name: employee?.first_name ?? "",
    last_name: employee?.last_name ?? "",
    phone: employee?.phone ?? "",
    email: employee?.email ?? "",
    position: employee?.position ?? "",
    experience: employee?.experience == null ? "" : String(employee.experience),
    branch_id: employee?.branch_id == null ? NO_BRANCH : String(employee.branch_id),
  }
}

export function AddEmployeePage() {
  const { id } = useParams()
  const employeeId = id ? Number(id) : undefined
  const isEdit = employeeId != null

  const { data: employee, isLoading } = useGetEmployeeQuery(employeeId!, { skip: !isEdit })

  if (isEdit && isLoading) return <p className="text-muted-foreground">Loading employee…</p>
  if (isEdit && !employee) return <p className="text-destructive">Employee not found.</p>

  // Remount on identity change so the form starts from the loaded record.
  return <EmployeeForm key={employee?.id ?? "new"} employee={employee} />
}

function EmployeeForm({ employee }: { employee?: Employee }) {
  const navigate = useNavigate()
  const isEdit = employee != null

  const { data: branches } = useGetBranchesQuery()
  /** No /positions endpoint exists — offer the positions already in use. */
  const { data: everyone } = useGetEmployeesQuery({ limit: 200 })

  const [createEmployee, { isLoading: creating }] = useCreateEmployeeMutation()
  const [updateEmployee, { isLoading: updating }] = useUpdateEmployeeMutation()

  const [form, setForm] = useState<FormState>(() => initialState(employee))
  const [customPosition, setCustomPosition] = useState(false)
  const [failed, setFailed] = useState(false)

  const positions = [...new Set((everyone?.data ?? []).map((e) => e.position).filter(Boolean))]
  const saving = creating || updating

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFailed(false)
    const body = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      position: form.position.trim(),
      experience: form.experience === "" ? null : Number(form.experience),
      branch_id: form.branch_id === NO_BRANCH ? null : Number(form.branch_id),
    }

    try {
      if (isEdit) await updateEmployee({ id: employee.id, data: body }).unwrap()
      else await createEmployee(body).unwrap()
      navigate("/employees")
    } catch {
      setFailed(true)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/employees")}
          className="rounded-md p-1 hover:bg-accent"
          aria-label="Back"
        >
          <ArrowLeft className="size-6" />
        </button>
        <h1 className="text-3xl font-bold">{isEdit ? "Edit employee" : "Add new employee"}</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="gap-5">
          <h2 className="text-xl font-bold">Basic details</h2>

          <div className="grid grid-cols-2 gap-4">
            <Field label="First name" required>
              <Input
                required
                value={form.first_name}
                onChange={(e) => set("first_name", e.target.value)}
                placeholder="First name"
              />
            </Field>
            <Field label="Last name" required>
              <Input
                required
                value={form.last_name}
                onChange={(e) => set("last_name", e.target.value)}
                placeholder="Last name"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone number" required>
              <Input
                required
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="900000000"
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="name@omuz.tj"
              />
            </Field>
          </div>

          <div className="grid grid-cols-[1fr_140px] gap-4">
            <Field label="Position" required>
              {customPosition || positions.length === 0 ? (
                <Input
                  required
                  value={form.position}
                  onChange={(e) => set("position", e.target.value)}
                  placeholder="mentor"
                />
              ) : (
                <Select
                  value={form.position}
                  onValueChange={(value) => {
                    if (value === CUSTOM) {
                      setCustomPosition(true)
                      set("position", "")
                    } else {
                      set("position", value)
                    }
                  }}
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((p) => (
                      <SelectItem key={p} value={p}>
                        {positionLabel(p)}
                      </SelectItem>
                    ))}
                    <SelectItem value={CUSTOM}>Other…</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </Field>
            <Field label="Experience (years)">
              <Input
                type="number"
                min={0}
                value={form.experience}
                onChange={(e) => set("experience", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Branch">
            <Select value={form.branch_id} onValueChange={(value) => set("branch_id", value)}>
              <SelectTrigger className="h-11 w-full">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_BRANCH}>No branch</SelectItem>
                {(branches?.data ?? []).map((b) => (
                  <SelectItem key={b.id} value={String(b.id)}>
                    {b.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </Card>

        <Card className="h-fit gap-3">
          <h2 className="text-xl font-bold">Photo</h2>
          <p className="text-sm text-muted-foreground">
            The backend's <code>Employee</code> model has no photo field and{" "}
            <code>POST /employees</code> accepts JSON only, so uploads are disabled until the API
            supports them.
          </p>
        </Card>
      </div>

      {failed && (
        <p className="text-sm text-destructive">
          Could not save the employee. Check the details and try again.
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" className="px-8" disabled={saving}>
          {saving ? "Saving…" : isEdit ? "Save changes" : "Save account"}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => navigate("/employees")}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs text-muted-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
    </div>
  )
}
