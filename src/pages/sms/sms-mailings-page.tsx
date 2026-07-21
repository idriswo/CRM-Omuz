import { useState } from "react"
import { ChevronDown, ClipboardList, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  useGetSmsGroupsQuery,
  useGetSmsHistoryQuery,
  useGetSmsRecipientsQuery,
  useGetSmsTemplatesQuery,
  useSendSmsMutation,
  type SmsRecipientType,
} from "@/store/services"
import { TemplatesDialog } from "./templates-dialog"

const tabs: { key: SmsRecipientType; label: string }[] = [
  { key: "group", label: "Group" },
  { key: "students", label: "Students" },
  { key: "mentors", label: "Mentors" },
  { key: "leads", label: "Leads" },
  { key: "graduates", label: "Graduates" },
]

function GroupList({ selected, onToggle }: { selected: Set<string>; onToggle: (key: string) => void }) {
  const [openGroups, setOpenGroups] = useState<number[]>([1])
  const { data } = useGetSmsGroupsQuery()

  const toggleGroup = (id: number) =>
    setOpenGroups((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]))

  return (
    <div className="flex flex-col divide-y divide-border">
      {data?.data.map((group) => {
        const open = openGroups.includes(group.id)
        const danger = group.present / group.studentsTotal < 0.6
        return (
          <div key={group.id} className="py-3">
            <button
              onClick={() => toggleGroup(group.id)}
              className="flex w-full items-center justify-between gap-3 px-1 text-left"
            >
              <div>
                <div className="font-semibold">{group.title}</div>
                <div className="text-xs text-muted-foreground">{group.period}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-0.5">
                  <Badge variant={danger ? "destructive" : "success"}>
                    {group.present}/{group.studentsTotal}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">students</span>
                </div>
                <ChevronDown className={cn("size-4 text-primary transition-transform", open && "rotate-180")} />
              </div>
            </button>
            {open && (
              <div className="mt-2 flex flex-col gap-1">
                <div className="flex items-center justify-between px-1 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                  <span>Full name</span>
                  <span>Phone</span>
                </div>
                {group.students.map((s) => {
                  const key = `${group.id}-${s.id}`
                  return (
                    <label
                      key={s.id}
                      className={cn(
                        "flex cursor-pointer items-center justify-between gap-3 rounded-md px-1 py-1.5",
                        selected.has(key) && "bg-accent"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <Checkbox checked={selected.has(key)} onCheckedChange={() => onToggle(key)} />
                        {s.full_name}
                      </span>
                      <span className="text-sm text-muted-foreground">{s.phone}</span>
                    </label>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function PersonList({
  type,
  search,
  selected,
  onToggle,
}: {
  type: Exclude<SmsRecipientType, "group">
  search: string
  selected: Set<number>
  onToggle: (id: number) => void
}) {
  const { data } = useGetSmsRecipientsQuery({ type, search })

  return (
    <div className="flex flex-col divide-y divide-border">
      {data?.data.map((p) => (
        <label
          key={p.id}
          className={cn(
            "flex cursor-pointer items-center gap-3 px-1 py-3",
            selected.has(p.id) && "bg-accent"
          )}
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            {p.full_name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 font-medium">
              {p.full_name}
              <span className="text-xs font-normal text-muted-foreground">{p.phone}</span>
              <span className="text-xs font-normal text-muted-foreground">{p.age} year</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              {type === "students" && <span className="text-primary">{p.course}</span>}
              {type === "mentors" && (
                <>
                  Level: <span className="text-primary">{p.level}</span>
                </>
              )}
              {type === "leads" && (
                <>
                  <span className="text-primary">{p.course}</span>
                  <Badge variant={p.tagVariant === "outline" ? "outline" : "secondary"} className="ml-1">
                    {p.tag}
                  </Badge>
                </>
              )}
              {type === "graduates" && (
                <>
                  <span className={p.tag?.startsWith("#") ? "text-primary" : "text-amber-500"}>{p.tag}</span>
                  <span className="text-muted-foreground">• {p.bank}</span>
                </>
              )}
            </div>
          </div>
          <Checkbox checked={selected.has(p.id)} onCheckedChange={() => onToggle(p.id)} />
        </label>
      ))}
    </div>
  )
}

export function SmsMailingsPage() {
  const [tab, setTab] = useState<SmsRecipientType>("group")
  const [search, setSearch] = useState("")
  const [selectedByTab, setSelectedByTab] = useState<Record<SmsRecipientType, Set<string | number>>>({
    group: new Set(),
    students: new Set(),
    mentors: new Set(),
    leads: new Set(),
    graduates: new Set(),
  })
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [templateId, setTemplateId] = useState<number | null>(null)
  const [templatesOpen, setTemplatesOpen] = useState(true)
  const [templatesDialogOpen, setTemplatesDialogOpen] = useState(false)
  const [expandedHistory, setExpandedHistory] = useState<number[]>([])

  const { data: templates } = useGetSmsTemplatesQuery()
  const { data: history } = useGetSmsHistoryQuery()
  const [sendSms, { isLoading: sending }] = useSendSmsMutation()

  const selected = selectedByTab[tab]

  const toggle = (key: string | number) => {
    setSelectedByTab((prev) => {
      const next = new Set(prev[tab])
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return { ...prev, [tab]: next }
    })
  }

  const handleSelectTemplate = (id: number) => {
    setTemplateId(id)
    const t = templates?.data.find((tpl) => tpl.id === id)
    if (t) {
      setTitle(t.title)
      setDescription(t.description)
    }
  }

  const handleSend = async () => {
    if (selected.size === 0) return
    await sendSms({
      recipient_type: tab,
      recipient_ids: Array.from(selected).map((k) => (typeof k === "number" ? k : Number(String(k).split("-")[1]))),
      template_id: templateId ?? undefined,
      title,
      text: description,
    })
    setTitle("")
    setDescription("")
    setTemplateId(null)
  }

  const toggleHistory = (id: number) =>
    setExpandedHistory((prev) => (prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]))

  const showSearch = tab !== "group"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">SMS mailings</h1>
        <Button variant="outline" size="lg" onClick={() => setTemplatesDialogOpen(true)}>
          <ClipboardList /> TEMPLATES
        </Button>
      </div>

      <div className="grid grid-cols-[1fr_380px] gap-6">
        <Card className="p-0">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="flex items-center gap-6">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground",
                    tab === t.key && "text-primary"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              Selected <span className="font-semibold text-foreground">{selected.size}</span>
            </span>
          </div>

          {showSearch && (
            <div className="flex items-center gap-3 px-6 pt-4">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Name..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="secondary" size="lg">
                SEARCH
              </Button>
            </div>
          )}

          <div className="max-h-[560px] overflow-y-auto px-6 py-2">
            {tab === "group" ? (
              <GroupList selected={selected as Set<string>} onToggle={toggle} />
            ) : (
              <PersonList type={tab} search={search} selected={selected as Set<number>} onToggle={toggle} />
            )}
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <h2 className="text-lg font-semibold">SMS text</h2>
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-lg border border-input bg-card px-3.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-ring"
            />

            <div className="rounded-lg border border-input">
              <button
                onClick={() => setTemplatesOpen((o) => !o)}
                className="flex w-full items-center justify-between px-3.5 py-2.5 text-sm font-medium"
              >
                Templates
                <ChevronDown className={cn("size-4 transition-transform", templatesOpen && "rotate-180")} />
              </button>
              {templatesOpen && (
                <div className="flex flex-col gap-1 border-t border-input p-2">
                  {templates?.data.map((t) => (
                    <label key={t.id} className="cursor-pointer rounded-md">
                      <div
                        className={cn(
                          "flex items-center gap-2 rounded-md px-2 py-2 text-sm",
                          templateId === t.id && "border border-primary"
                        )}
                      >
                        <input
                          type="radio"
                          checked={templateId === t.id}
                          onChange={() => handleSelectTemplate(t.id)}
                          className="accent-primary"
                        />
                        {t.title}
                      </div>
                      {templateId === t.id && (
                        <p className="mt-1 mb-2 px-2 text-xs whitespace-pre-line text-muted-foreground">{t.description}</p>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <Button size="lg" className="w-full" disabled={sending || selected.size === 0} onClick={handleSend}>
              Send
            </Button>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold">History</h2>
            <div className="flex flex-col divide-y divide-border">
              {history?.data.map((h) => {
                const open = expandedHistory.includes(h.id)
                return (
                  <div key={h.id} className="py-3">
                    <button onClick={() => toggleHistory(h.id)} className="flex w-full items-center justify-between">
                      <span className="flex items-center gap-2 font-medium">
                        <ChevronDown className={cn("size-4 text-primary transition-transform", open && "rotate-180")} />
                        {h.title}
                      </span>
                      <span className="text-xs text-muted-foreground">{h.sent_at}</span>
                    </button>
                    {open && (
                      <div className="mt-2 pl-6 text-sm text-muted-foreground">
                        <p className="whitespace-pre-line">{h.description}</p>
                        {h.groups.length > 0 && (
                          <div className="mt-2 flex flex-col gap-2">
                            <span className="font-medium text-foreground">Groups:</span>
                            {h.groups.map((g) => (
                              <div key={g.name}>
                                <span className="font-medium text-foreground">{g.name}</span> · {g.period}
                                <div>{g.members}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>

      <TemplatesDialog open={templatesDialogOpen} onOpenChange={setTemplatesDialogOpen} />
    </div>
  )
}
