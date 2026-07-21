import { ChevronLeft, ChevronRight, ClipboardList } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { RoadmapGroup } from "@/store/services"

/** Week chips are colour-coded by score so weak weeks stand out at a glance. */
function weekColor(score: number) {
  if (score >= 90) return "text-success border-success/40"
  if (score >= 80) return "text-amber-500 border-amber-500/40"
  if (score >= 50) return "text-orange-500 border-orange-500/40"
  return "text-destructive border-destructive/40"
}

export function RoadmapCard({ group }: { group: RoadmapGroup }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
            style={{ background: group.color }}
          >
            {group.initials}
          </span>
          <div>
            <p className="flex items-center gap-1 font-bold text-primary">
              {group.title} <ChevronRight className="size-4" />
            </p>
            <p className="text-sm text-muted-foreground">{group.period}</p>
          </div>
        </div>
        <Button variant="ghost" className="bg-accent text-primary" size="sm">
          <ClipboardList className="size-4" /> Journal
        </Button>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Previous weeks">
          <ChevronLeft className="size-4" />
        </Button>
        <div className="flex flex-1 flex-wrap gap-2">
          {group.weeks.map((week) => (
            <div
              key={week.week}
              className={`flex min-w-16 flex-col items-center rounded-lg border px-3 py-1.5 ${weekColor(week.score)}`}
            >
              <span className="text-lg font-bold">{week.score}</span>
              <span className="text-xs text-muted-foreground">Week {week.week}</span>
            </div>
          ))}
        </div>
        <Button variant="ghost" size="icon" aria-label="Next weeks">
          <ChevronRight className="size-4" />
        </Button>
        <div className="flex min-w-16 flex-col items-center rounded-lg bg-muted px-3 py-1.5">
          <span className="text-lg font-bold">{group.average}</span>
          <span className="text-xs text-muted-foreground">Average</span>
        </div>
      </div>
    </div>
  )
}
