import { useNavigate } from "react-router-dom"
import { ArrowLeft, Calendar, FilePlus2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { positions } from "./mock-data"

const branches = ["Sadbarg", "Profsous"]

export function AddEmployeePage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/employees")}
          className="rounded-md p-1 hover:bg-accent"
          aria-label="Back"
        >
          <ArrowLeft className="size-6" />
        </button>
        <h1 className="text-3xl font-bold">Add new employee</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Basic details */}
        <Card className="gap-5">
          <h2 className="text-xl font-bold">Basic details</h2>

          <Input placeholder="First name" />
          <Input placeholder="Last name" />

          <div className="relative">
            <Input placeholder="Birth date" className="pr-10" />
            <Calendar className="pointer-events-none absolute top-1/2 right-3.5 size-5 -translate-y-1/2 text-muted-foreground" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="Phone number" />
            <Input placeholder="Email" type="email" />
          </div>

          <Input placeholder="Adress" />

          <div className="grid grid-cols-[1fr_140px] gap-4">
            <Select>
              <SelectTrigger className="h-11 w-full">
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Experience</label>
              <Input type="number" defaultValue={0} min={0} />
            </div>
          </div>

          <Select>
            <SelectTrigger className="h-11 w-full">
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input placeholder="Telegram user name" />
          <Textarea placeholder="Description" />
        </Card>

        {/* Photo */}
        <Card className="h-fit gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Photo</h2>
            <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-destructive">
              <Trash2 className="size-4" /> Remove foto
            </button>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-input px-6 py-14 text-center">
            <FilePlus2 className="size-12 text-primary" strokeWidth={1.5} />
            <p className="font-bold">Select file</p>
            <p className="text-sm text-muted-foreground">
              Click or drag file to this area to upload
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/80">
              Choose avatar
            </Button>
            <Button disabled>Save</Button>
          </div>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <Button size="lg" className="px-8">
          Save account
        </Button>
        <Button variant="outline" size="lg" onClick={() => navigate("/employees")}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
