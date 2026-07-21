import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"

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
import { PhotoCard } from "@/components/shared/photo-card"
import { RadioPills } from "@/components/shared/radio-pills"
import { SegmentedToggle } from "@/components/shared/segmented-toggle"
import {
  useCreateStudentMutation,
  useGetBranchesQuery,
  useGetStudentQuery,
  useUpdateStudentMutation,
  type StudentBody,
  type StudentPhone,
} from "@/store/services"

const emptyForm: StudentBody = {
  first_name: "",
  last_name: "",
  birth_date: "",
  gender: "male",
  address: "",
  email: "",
  status: "active",
  phone: "",
  phones: [],
  branch_id: null,
  telegram_username: "",
  description: "",
  photo: null,
}

export function StudentFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const { data: student } = useGetStudentQuery(Number(id), { skip: !isEdit })
  const { data: branches } = useGetBranchesQuery()
  const [createStudent, { isLoading: isCreating }] = useCreateStudentMutation()
  const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation()

  const [form, setForm] = useState<StudentBody>(emptyForm)
  const [loadedId, setLoadedId] = useState<number | null>(null)

  // Seed the form once the fetched student arrives (adjusting state during render).
  if (student && loadedId !== student.id) {
    setLoadedId(student.id)
    setForm({
      first_name: student.first_name,
      last_name: student.last_name,
      birth_date: student.birth_date,
      gender: student.gender,
      address: student.address,
      email: student.email,
      status: student.status === "inactive" ? "inactive" : "active",
      phone: student.phone,
      phones: student.phones,
      branch_id: student.branch_id,
      telegram_username: student.telegram_username,
      description: student.description,
      photo: student.photo,
    })
  }

  const set = <K extends keyof StudentBody>(key: K, value: StudentBody[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const setPhone = (index: number, patch: Partial<StudentPhone>) =>
    setForm((prev) => ({
      ...prev,
      phones: prev.phones.map((phone, i) => (i === index ? { ...phone, ...patch } : phone)),
    }))

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (isEdit) {
      await updateStudent({ id: Number(id), data: form })
    } else {
      await createStudent(form)
    }
    navigate("/students")
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/students" aria-label="Back to students">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{isEdit ? "Edit profile" : "Add new student"}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card className="gap-5">
          <h2 className="text-xl font-bold">Basic details</h2>

          <Input
            placeholder="First name"
            value={form.first_name}
            onChange={(e) => set("first_name", e.target.value)}
          />
          <Input
            placeholder="Last name"
            value={form.last_name}
            onChange={(e) => set("last_name", e.target.value)}
          />
          <Input
            type="date"
            placeholder="Birth date"
            value={form.birth_date}
            onChange={(e) => set("birth_date", e.target.value)}
          />

          <div className="flex items-center gap-6">
            <Label className="w-28 text-base font-semibold">Gender</Label>
            <div className="flex-1">
              <RadioPills
                value={form.gender}
                onChange={(value) => set("gender", value)}
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                ]}
              />
            </div>
          </div>

          <Input
            placeholder="Adress"
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />

          <div className="flex items-center gap-6">
            <Label className="w-28 text-base font-semibold">Status</Label>
            <div className="flex flex-1 justify-end">
              {/* Editing shows the joined toggle; creating uses the radio pair. */}
              {isEdit ? (
                <SegmentedToggle
                  value={form.status}
                  onChange={(value) => set("status", value)}
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                />
              ) : (
                <div className="w-full">
                  <RadioPills
                    value={form.status}
                    onChange={(value) => set("status", value)}
                    options={[
                      { value: "active", label: "Active" },
                      { value: "inactive", label: "Inactive" },
                    ]}
                  />
                </div>
              )}
            </div>
          </div>

          <Input
            placeholder="Phone number"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
          />

          <div className="flex flex-col gap-3">
            <Label className="text-muted-foreground">Phones</Label>
            {form.phones.map((phone, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder="Phone number"
                  value={phone.number}
                  onChange={(e) => setPhone(index, { number: e.target.value })}
                />
                <Input
                  placeholder="Description"
                  value={phone.label}
                  onChange={(e) => setPhone(index, { label: e.target.value })}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Remove phone"
                  className="shrink-0 border-destructive/50"
                  onClick={() =>
                    set(
                      "phones",
                      form.phones.filter((_, i) => i !== index)
                    )
                  }
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-fit text-primary"
              onClick={() => set("phones", [...form.phones, { label: "", number: "" }])}
            >
              <Plus /> Add new phone
            </Button>
          </div>

          <Select
            value={form.branch_id ? String(form.branch_id) : undefined}
            onValueChange={(value) => set("branch_id", Number(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent>
              {branches?.data.map((branch) => (
                <SelectItem key={branch.id} value={String(branch.id)}>
                  {branch.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Telegram user name"
            value={form.telegram_username}
            onChange={(e) => set("telegram_username", e.target.value)}
          />
          <Input
            placeholder={isEdit ? "Notes" : "Description"}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </Card>

        <PhotoCard photo={form.photo} onChange={(photo) => set("photo", photo)} />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={isCreating || isUpdating}>
          Save account
        </Button>
        <Button type="button" variant="outline" size="lg" className="text-primary" asChild>
          <Link to="/students">Cancel</Link>
        </Button>
      </div>
    </form>
  )
}
