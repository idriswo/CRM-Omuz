import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRightLeft, Calendar, Plus, Search, SquarePen, Ticket, Upload, UserPlus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { leads, leadCourses, type Lead } from "./mock-data"

export function LeadsPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const toggle = (id: number) =>
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const allChecked = selected.size === leads.length
  const toggleAll = () =>
    setSelected(allChecked ? new Set() : new Set(leads.map((l) => l.id)))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Leads</h1>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="lg" disabled={selected.size === 0}>
            Transfer <ArrowRightLeft className="text-primary" />
          </Button>
          <Button variant="outline" size="lg">
            <Upload className="text-primary" /> Export
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate("/courses/coupons")}>
            <Ticket className="text-primary" /> Coupons
          </Button>
          <Button size="lg">
            <Plus /> Add new
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name" className="pl-10" />
        </div>
        <Input placeholder="Phone" className="w-40" />
        <Select>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Course" />
          </SelectTrigger>
          <SelectContent>
            {leadCourses.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DateField label="From date" value="01.08.2024" />
        <DateField label="To date" value="01.09.2024" />
      </div>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/60 text-left text-muted-foreground">
                <th className="px-4 py-4">
                  <Checkbox checked={allChecked} onCheckedChange={toggleAll} aria-label="Select all" />
                </th>
                <th className="px-4 py-4 font-semibold">FULL NAME</th>
                <th className="px-4 py-4 font-semibold">LESSON TIME</th>
                <th className="px-4 py-4 font-semibold">COURSE</th>
                <th className="px-4 py-4 font-semibold">UTM-SOURSE</th>
                <th className="px-4 py-4 font-semibold">OCCUPATION</th>
                <th className="px-4 py-4 font-semibold">REGISTER</th>
                <th className="px-4 py-4 font-semibold">NOTES</th>
                <th className="px-4 py-4 font-semibold">TYPE</th>
                <th className="px-4 py-4 font-semibold">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <LeadRow
                  key={lead.id}
                  lead={lead}
                  checked={selected.has(lead.id)}
                  onToggle={() => toggle(lead.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function LeadRow({
  lead,
  checked,
  onToggle,
}: {
  lead: Lead
  checked: boolean
  onToggle: () => void
}) {
  return (
    <tr
      className={cn(
        "border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40",
        checked && "bg-primary/5"
      )}
    >
      <td className="px-4 py-3">
        <Checkbox checked={checked} onCheckedChange={onToggle} aria-label="Select row" />
      </td>
      <td className="px-4 py-3">
        <p className="font-semibold">{lead.fullName}</p>
        <p className="text-xs text-muted-foreground">{lead.phone}</p>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{lead.lessonTime}</td>
      <td className="px-4 py-3 text-muted-foreground">{lead.course}</td>
      <td className="px-4 py-3 text-muted-foreground">{lead.utmSource}</td>
      <td className="px-4 py-3 text-muted-foreground">{lead.occupation}</td>
      <td className="px-4 py-3 text-muted-foreground">{lead.register}</td>
      <td className="px-4 py-3 text-muted-foreground">{lead.notes}</td>
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
            lead.type === "Lead"
              ? "bg-orange-100 text-orange-500 dark:bg-orange-500/15 dark:text-orange-300"
              : "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300"
          )}
        >
          {lead.type}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button className="rounded-md p-1.5 hover:bg-accent" aria-label="Edit">
            <SquarePen className="size-4 text-primary" />
          </button>
          <button className="rounded-md p-1.5 hover:bg-accent" aria-label="Convert to client">
            <UserPlus className="size-4 text-primary" />
          </button>
        </div>
      </td>
    </tr>
  )
}

function DateField({ label, value }: { label: string; value: string }) {
  return (
    <div className="relative">
      <label className="mb-1 block text-xs text-muted-foreground">{label}</label>
      <div className="relative">
        <Input defaultValue={value} className="w-40 pr-9" />
        <Calendar className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  )
}
