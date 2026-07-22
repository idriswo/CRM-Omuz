import { cn } from "@/lib/utils"
import { positionLabel, positionStyles } from "./employee-format"

export function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold",
        positionStyles[role?.toLowerCase()] ?? "bg-secondary text-muted-foreground"
      )}
    >
      {positionLabel(role)}
    </span>
  )
}
