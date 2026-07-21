import { useState, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { ChevronDown, ClipboardList } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { GroupedRow } from "@/store/services"

/**
 * "Groups" tab shared by Graduates and Left courses: one collapsible row per group
 * with the group's own rows rendered as a nested table.
 */
export function GroupAccordion<T extends { id: number }>({
  groups,
  isLoading,
  columns,
  renderRow,
}: {
  groups: GroupedRow<T>[]
  isLoading?: boolean
  columns: string[]
  renderRow: (row: T) => ReactNode
}) {
  // `null` means untouched, so the second group can open by default once data lands.
  const [open, setOpen] = useState<number[] | null>(null)
  const expanded = open ?? (groups[1] ? [groups[1].id] : groups[0] ? [groups[0].id] : [])

  const toggle = (id: number) =>
    setOpen(expanded.includes(id) ? expanded.filter((o) => o !== id) : [...expanded, id])

  return (
    <Card className="gap-0 p-0">
      <div className="grid grid-cols-[2fr_1fr_1.5fr_auto] gap-4 rounded-t-2xl bg-muted/60 px-4 py-3 text-xs font-bold uppercase tracking-wide text-foreground/80">
        <span>Group</span>
        <span>Students</span>
        <span>Date</span>
        <span>Journal</span>
      </div>

      {isLoading && <p className="px-4 py-8 text-center text-muted-foreground">Loading...</p>}

      {groups.map((group) => {
        const isOpen = expanded.includes(group.id)
        return (
          <div key={group.id} className="border-b border-border last:border-0">
            <div className="grid grid-cols-[2fr_1fr_1.5fr_auto] items-center gap-4 px-4 py-3">
              <button
                type="button"
                onClick={() => toggle(group.id)}
                className="flex items-center gap-3 text-left text-lg font-bold"
              >
                <ChevronDown
                  className={cn("size-5 transition-transform", isOpen && "rotate-180")}
                />
                {group.name}
              </button>
              <span>{group.students_count}</span>
              <span className="text-muted-foreground">{group.period}</span>
              <Button variant="ghost" size="icon" className="bg-accent" asChild>
                <Link to={`/groups/${group.id}/journal`} aria-label={`Journal of ${group.name}`}>
                  <ClipboardList className="size-4 text-primary" />
                </Link>
              </Button>
            </div>

            {isOpen && (
              <div className="px-4 pb-4">
                <div className="rounded-xl border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {columns.map((column, i) => (
                          <TableHead
                            key={column}
                            className={i === columns.length - 1 ? "text-right" : undefined}
                          >
                            {column}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>{group.rows.map(renderRow)}</TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </Card>
  )
}
