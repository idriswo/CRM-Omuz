import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card } from "@/components/ui/card"
import type { MonthlyPoint } from "@/store/services"

function AreaTooltip({
  active,
  payload,
  label,
  seriesLabel,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
  seriesLabel: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover text-sm shadow-md">
      <p className="border-b border-border px-3 py-2">{label}</p>
      <div className="flex items-center gap-2 px-3 py-2">
        <span className="size-2 rounded-full bg-primary" />
        <span className="text-muted-foreground">{seriesLabel}:</span>
        <span className="font-semibold">{payload[0].value}</span>
      </div>
    </div>
  )
}

export function MonthlyAreaChart({
  title,
  seriesLabel,
  data,
  year,
  onYearChange,
}: {
  title: string
  seriesLabel: string
  data: MonthlyPoint[]
  year: number
  onYearChange: (year: number) => void
}) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex items-center gap-1 rounded-lg border border-input bg-card px-2 py-1.5">
          <button
            type="button"
            onClick={() => onYearChange(year - 1)}
            className="rounded p-1 hover:bg-accent"
            aria-label="Previous year"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="min-w-[80px] text-center text-sm font-medium">{year} year</span>
          <button
            type="button"
            onClick={() => onYearChange(year + 1)}
            className="rounded p-1 hover:bg-accent"
            aria-label="Next year"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="monthlyArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.55} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--color-border)" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
            />
            <Tooltip content={<AreaTooltip seriesLabel={seriesLabel} />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-primary)"
              strokeWidth={2.5}
              fill="url(#monthlyArea)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
