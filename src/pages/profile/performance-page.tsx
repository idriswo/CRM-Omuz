import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RoadmapCard } from "@/components/shared/roadmap-card"
import { useGetPerformanceQuery } from "@/store/services"

function DetailTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { payload: { present: string; late: string; comment: string; score?: number } }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload
  return (
    <div className="max-w-56 rounded-lg border border-border bg-popover text-sm shadow-md">
      <p className="border-b border-border px-3 py-2 font-medium">{label}</p>
      <dl className="flex flex-col gap-1 px-3 py-2">
        {point.score !== undefined && (
          <div className="flex justify-between gap-6">
            <dt className="text-muted-foreground">Score:</dt>
            <dd className="font-semibold">{point.score}</dd>
          </div>
        )}
        <div className="flex justify-between gap-6">
          <dt className="text-muted-foreground">Present:</dt>
          <dd className="font-semibold">{point.present}</dd>
        </div>
        <div className="flex justify-between gap-6">
          <dt className="text-muted-foreground">Late:</dt>
          <dd className="font-semibold">{point.late}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Comment:</dt>
          <dd className="font-semibold">{point.comment}</dd>
        </div>
      </dl>
    </div>
  )
}

export function PerformancePage() {
  const [year, setYear] = useState(2024)
  const { data } = useGetPerformanceQuery({ year })

  if (!data) return <p className="text-muted-foreground">Loading...</p>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/profile" aria-label="Back to profile">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Performance</h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="sm:col-span-2 flex-row items-center justify-between py-5">
            <span className="text-lg font-medium">Present</span>
            <span className="text-2xl font-bold text-success">
              {data.present_hours} <span className="text-sm font-medium">hour</span>
            </span>
          </Card>
          <Card className="flex-row items-center justify-between py-5">
            <span className="text-lg font-medium">Absent</span>
            <span className="text-2xl font-bold text-destructive">
              {data.absent_hours} <span className="text-sm font-medium">hour</span>
            </span>
          </Card>
          <Card className="flex-row items-center justify-between py-5">
            <span className="text-lg font-medium">Late</span>
            <span className="text-2xl font-bold text-orange-500">
              {data.late_minutes} <span className="text-sm font-medium">min</span>
            </span>
          </Card>
        </div>

        <Card className="gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="flex items-center gap-1 font-bold text-primary">
                {data.group} <ChevronRight className="size-4" />
              </p>
              <p className="text-sm text-muted-foreground">Week {data.week}</p>
            </div>
          </div>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.days} margin={{ top: 8, right: 8, bottom: 0, left: -30 }}>
                <defs>
                  <linearGradient id="perfWeek" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--color-border)" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                />
                <YAxis hide />
                <Tooltip content={<DetailTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                  fill="url(#perfWeek)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-semibold">
            <span className="size-2.5 rounded-full bg-primary" /> Expense
          </span>
          <div className="flex items-center gap-1 rounded-lg border border-input px-2 py-1.5">
            <button
              type="button"
              onClick={() => setYear((y) => y - 1)}
              className="rounded p-1 hover:bg-accent"
              aria-label="Previous year"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="min-w-[80px] text-center text-sm font-medium">{year} year</span>
            <button
              type="button"
              onClick={() => setYear((y) => y + 1)}
              className="rounded p-1 hover:bg-accent"
              aria-label="Next year"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.expense} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="perfExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.45} />
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
              <Tooltip content={<DetailTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--color-primary)"
                strokeWidth={2.5}
                fill="url(#perfExpense)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-bold">Groups roadmap</h2>
        <div className="flex flex-col gap-4">
          {data.roadmap.map((group) => (
            <RoadmapCard key={group.id} group={group} />
          ))}
        </div>
      </Card>
    </div>
  )
}
