import { LayoutGrid, Rows3 } from "lucide-react"

import { cn } from "@/lib/utils"

export type ViewMode = "grid" | "list"

export function ViewToggle({
  value,
  onChange,
}: {
  value: ViewMode
  onChange: (value: ViewMode) => void
}) {
  const options: { mode: ViewMode; icon: typeof LayoutGrid; label: string }[] = [
    { mode: "grid", icon: LayoutGrid, label: "Grid view" },
    { mode: "list", icon: Rows3, label: "List view" },
  ]

  return (
    <div className="flex items-center gap-1 rounded-lg border border-input bg-muted/60 p-1">
      {options.map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          type="button"
          aria-label={label}
          aria-pressed={value === mode}
          onClick={() => onChange(mode)}
          className={cn(
            "rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground",
            value === mode && "bg-card text-primary shadow-xs"
          )}
        >
          <Icon className="size-4" />
        </button>
      ))}
    </div>
  )
}
