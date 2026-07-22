import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRightLeft, Plus, Search, SquarePen, Ticket, Trash2, Upload, UserPlus } from "lucide-react"

import { cn } from "@/lib/utils"
import { api as http } from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { LeadDialog } from "./lead-dialog"
import {
  useConvertLeadToClientMutation,
  useDeleteLeadMutation,
  useGetCoursesQuery,
  useGetLeadsQuery,
  useTransferLeadsMutation,
  type Lead,
  type LeadType,
} from "@/store/services"

const ALL = "all"

export function LeadsPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [search, setSearch] = useState("")
  const [courseId, setCourseId] = useState(ALL)
  const [type, setType] = useState(ALL)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Lead | null>(null)
  const [transferOpen, setTransferOpen] = useState(false)
  const [exporting, setExporting] = useState(false)

  const { data, isLoading, isError } = useGetLeadsQuery({
    search: search || undefined,
    course_id: courseId === ALL ? undefined : Number(courseId),
    type: type === ALL ? undefined : (type as LeadType),
    limit: 100,
  })
  const { data: courses } = useGetCoursesQuery({ limit: 100 })
  const [deleteLead, { isLoading: deleting }] = useDeleteLeadMutation()
  const [convertLead, { isLoading: converting }] = useConvertLeadToClientMutation()

  const leads = data?.data ?? []
  const courseNames = useMemo(
    () => new Map((courses?.data ?? []).map((c) => [c.id, c.name])),
    [courses]
  )

  const toggle = (id: number) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const allChecked = leads.length > 0 && selected.size === leads.length
  const toggleAll = () => setSelected(allChecked ? new Set() : new Set(leads.map((l) => l.id)))

  const handleExport = async () => {
    setExporting(true)
    try {
      const response = await http.get("/leads/export", {
        responseType: "blob",
        params: {
          search: search || undefined,
          course_id: courseId === ALL ? undefined : Number(courseId),
          type: type === ALL ? undefined : type,
        },
      })
      const url = URL.createObjectURL(response.data as Blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "leads.xlsx"
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Leads</h1>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="lg"
            disabled={selected.size === 0}
            onClick={() => setTransferOpen(true)}
          >
            Transfer <ArrowRightLeft className="text-primary" />
          </Button>
          <Button variant="outline" size="lg" onClick={handleExport} disabled={exporting}>
            <Upload className="text-primary" /> {exporting ? "Exporting…" : "Export"}
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate("/courses/coupons")}>
            <Ticket className="text-primary" /> Coupons
          </Button>
          <Button
            size="lg"
            onClick={() => {
              setEditing(null)
              setDialogOpen(true)
            }}
          >
            <Plus /> Add new
          </Button>
        </div>
      </div>

      {/* Filters — only the ones `GET /leads` actually supports */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name"
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={courseId} onValueChange={setCourseId}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All courses</SelectItem>
            {(courses?.data ?? []).map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All types</SelectItem>
            <SelectItem value="Lead">Lead</SelectItem>
            <SelectItem value="Client">Client</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading leads…</p>}
      {isError && <p className="text-sm text-destructive">Could not load leads.</p>}

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/60 text-left text-muted-foreground">
                <th className="px-4 py-4">
                  <Checkbox
                    checked={allChecked}
                    onCheckedChange={toggleAll}
                    aria-label="Select all"
                  />
                </th>
                <th className="px-4 py-4 font-semibold">FULL NAME</th>
                <th className="px-4 py-4 font-semibold">LESSON TIME</th>
                <th className="px-4 py-4 font-semibold">COURSE</th>
                <th className="px-4 py-4 font-semibold">UTM-SOURCE</th>
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
                  courseName={lead.course_id ? courseNames.get(lead.course_id) : undefined}
                  checked={selected.has(lead.id)}
                  onToggle={() => toggle(lead.id)}
                  onEdit={() => {
                    setEditing(lead)
                    setDialogOpen(true)
                  }}
                  onConvert={() => convertLead(lead.id)}
                  onDelete={async () => {
                    if (confirm(`Delete ${lead.full_name}?`)) await deleteLead(lead.id)
                  }}
                  disabled={deleting || converting}
                />
              ))}
              {leads.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-muted-foreground">
                    No leads yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <LeadDialog open={dialogOpen} onOpenChange={setDialogOpen} lead={editing} />
      <TransferDialog
        open={transferOpen}
        onOpenChange={setTransferOpen}
        leadIds={[...selected]}
        onDone={() => setSelected(new Set())}
      />
    </div>
  )
}

function LeadRow({
  lead,
  courseName,
  checked,
  onToggle,
  onEdit,
  onConvert,
  onDelete,
  disabled,
}: {
  lead: Lead
  courseName?: string
  checked: boolean
  onToggle: () => void
  onEdit: () => void
  onConvert: () => void
  onDelete: () => void
  disabled: boolean
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
        <p className="font-semibold">{lead.full_name}</p>
        <p className="text-xs text-muted-foreground">{lead.phone}</p>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{lead.lesson_time || "—"}</td>
      <td className="px-4 py-3 text-muted-foreground">{courseName ?? "—"}</td>
      <td className="px-4 py-3 text-muted-foreground">{lead.utm_source || "—"}</td>
      <td className="px-4 py-3 text-muted-foreground">{lead.occupation || "—"}</td>
      <td className="px-4 py-3 text-muted-foreground">
        {lead.created_at ? new Date(lead.created_at).toLocaleDateString("en-GB") : "—"}
      </td>
      <td className="px-4 py-3 text-muted-foreground">{lead.notes || "—"}</td>
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
          <button className="rounded-md p-1.5 hover:bg-accent" aria-label="Edit" onClick={onEdit}>
            <SquarePen className="size-4 text-primary" />
          </button>
          <button
            className="rounded-md p-1.5 hover:bg-accent disabled:opacity-40"
            aria-label="Convert to client"
            title="Convert to client"
            onClick={onConvert}
            disabled={disabled || lead.type === "Client"}
          >
            <UserPlus className="size-4 text-primary" />
          </button>
          <button
            className="rounded-md p-1.5 hover:bg-accent disabled:opacity-40"
            aria-label="Delete"
            onClick={onDelete}
            disabled={disabled}
          >
            <Trash2 className="size-4 text-destructive" />
          </button>
        </div>
      </td>
    </tr>
  )
}

function TransferDialog({
  open,
  onOpenChange,
  leadIds,
  onDone,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  leadIds: number[]
  onDone: () => void
}) {
  const { data: courses } = useGetCoursesQuery({ limit: 100 })
  const [transferLeads, { isLoading }] = useTransferLeadsMutation()
  const [target, setTarget] = useState("")

  const handleTransfer = async () => {
    if (!target) return
    await transferLeads({ lead_ids: leadIds, target_course_id: Number(target) })
    onDone()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Transfer {leadIds.length} lead(s)</DialogTitle>
        </DialogHeader>
        <Select value={target} onValueChange={setTarget}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Target course" />
          </SelectTrigger>
          <SelectContent>
            {(courses?.data ?? []).map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleTransfer} disabled={!target || isLoading}>
            {isLoading ? "Transferring…" : "Transfer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
