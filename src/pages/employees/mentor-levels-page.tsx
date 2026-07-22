import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Check, SquarePen, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { apiErrorMessage } from "@/lib/api-error"
import { Toast } from "@/components/shared/toast"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useGetEmployeesQuery,
  useGetMentorLevelsQuery,
  useUpdateMentorLevelMutation,
} from "@/store/services"
import { levelColor } from "./employee-format"

/** The backend stores `MentorLevel.level` as free text, so this ladder is a
 * client-side vocabulary for the picker — anything else can still be typed. */
const LEVELS = [
  "Intern",
  "Junior 1",
  "Junior 2",
  "Junior 3",
  "Middle 1",
  "Middle 2",
  "Senior 1",
  "Senior 2",
  "Senior 3",
]

export function MentorLevelsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [editing, setEditing] = useState<number | null>(null)
  const [draft, setDraft] = useState("")
  const [error, setError] = useState<string | null>(null)

  const { data: levels, isLoading, isError } = useGetMentorLevelsQuery()
  const { data: employees } = useGetEmployeesQuery({ limit: 200 })
  const [updateMentorLevel, { isLoading: saving }] = useUpdateMentorLevelMutation()

  const rows = useMemo(() => {
    const byEmployee = new Map((levels ?? []).map((l) => [l.employee_id, l]))
    return (employees?.data ?? [])
      .filter((e) => e.position?.toLowerCase() === "mentor" || byEmployee.has(e.id))
      .map((e) => ({
        employeeId: e.id,
        fullName: e.fullName,
        phone: e.phone,
        level: byEmployee.get(e.id) ?? null,
      }))
      .filter((r) => r.fullName.toLowerCase().includes(search.toLowerCase()))
  }, [levels, employees, search])

  const save = async (levelId: number) => {
    if (!draft.trim()) return
    try {
      await updateMentorLevel({ id: levelId, level: draft.trim() }).unwrap()
      setEditing(null)
    } catch (err) {
      setError(apiErrorMessage(err, { fallback: "Could not save the mentor level." }))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/employees")}
            className="rounded-md p-1 hover:bg-accent"
            aria-label="Back"
          >
            <ArrowLeft className="size-6" />
          </button>
          <h1 className="text-3xl font-bold">Mentor levels</h1>
        </div>

        <Input
          placeholder="Search mentor"
          className="w-full max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading mentor levels…</p>}
      {isError && <p className="text-sm text-destructive">Could not load mentor levels.</p>}

      <Card className="overflow-x-auto p-0">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/60 text-left text-muted-foreground">
              <th className="px-5 py-4 font-semibold">FULL NAME</th>
              <th className="px-5 py-4 font-semibold">PHONE</th>
              <th className="px-5 py-4 font-semibold">CURRENT LEVEL</th>
              <th className="px-5 py-4 text-right font-semibold">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.employeeId} className="border-b border-border/60 last:border-0">
                <td className="px-5 py-4 font-medium whitespace-nowrap">{row.fullName}</td>
                <td className="px-5 py-4 text-muted-foreground">{row.phone}</td>
                <td className="px-5 py-4">
                  {row.level && editing === row.level.id ? (
                    <Select value={draft} onValueChange={setDraft}>
                      <SelectTrigger className="w-44">
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...new Set([...LEVELS, row.level.level].filter(Boolean))].map((l) => (
                          <SelectItem key={l} value={l}>
                            {l}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : row.level ? (
                    <span className={cn("font-semibold", levelColor(row.level.level))}>
                      {row.level.level}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Not set</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    {row.level && editing === row.level.id ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Save level"
                          disabled={saving}
                          onClick={() => save(row.level!.id)}
                        >
                          <Check className="size-4 text-success" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Cancel"
                          onClick={() => setEditing(null)}
                        >
                          <X className="size-4 text-muted-foreground" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edit level"
                        disabled={!row.level}
                        title={
                          row.level
                            ? "Edit level"
                            : "No mentor-level record — the API has no endpoint to create one"
                        }
                        onClick={() => {
                          setEditing(row.level!.id)
                          setDraft(row.level!.level)
                        }}
                      >
                        <SquarePen className="size-4 text-primary" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && !isLoading && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">
                  No mentors yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <p className="text-sm text-muted-foreground">
        The API stores one current level per mentor (<code>GET /employees/mentor-levels</code>). A
        month-by-month history — and creating a level for a mentor who has none — needs new
        endpoints.
      </p>

      {error && (
        <Toast message={error} variant="error" duration={6000} onClose={() => setError(null)} />
      )}
    </div>
  )
}
