import type { LucideIcon } from "lucide-react"

import { Card } from "@/components/ui/card"

export function StatCard({
  value,
  label,
  color,
  icon: Icon,
}: {
  value: number | string
  label: string
  color: string
  icon: LucideIcon
}) {
  return (
    <Card className="flex flex-col items-center justify-center gap-1 py-5">
      <span className="text-3xl font-bold" style={{ color }}>
        {value}
      </span>
      <span className="flex items-center gap-2 text-sm font-medium">
        <Icon className="size-4" />
        {label}
      </span>
    </Card>
  )
}
