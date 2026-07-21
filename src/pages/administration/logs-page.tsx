import { useMemo, useState } from "react"
import { CheckCircle2 } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useGetLogsQuery, type LogEntry } from "@/store/services"

function formatGroupLabel(dateStr: string) {
  const date = new Date(dateStr)
  const today = new Date()
  if (date.toDateString() === today.toDateString()) return "Today"
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function LogsPage() {
  const [from, setFrom] = useState("2024-09-01")
  const [to, setTo] = useState("2024-10-01")
  const { data } = useGetLogsQuery({})

  const groups = useMemo(() => {
    const map = new Map<string, LogEntry[]>()
    for (const log of data?.data ?? []) {
      const label = formatGroupLabel(log.date)
      const bucket = map.get(label) ?? []
      bucket.push(log)
      map.set(label, bucket)
    }
    return Array.from(map.entries())
  }, [data])

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Logs</h1>

      <div className="flex gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="from">From</Label>
          <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-48" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="to">To</Label>
          <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-48" />
        </div>
      </div>

      {groups.map(([label, entries]) => (
        <div key={label} className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">{label}</p>
          {entries.map((log) => (
            <Card key={log.id} className="flex-row items-center gap-3 p-4">
              <CheckCircle2 className="size-6 shrink-0 text-success" />
              <div>
                <p className="font-semibold">{log.action}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(log.date).toLocaleTimeString("en-GB")}
                </p>
              </div>
            </Card>
          ))}
        </div>
      ))}
    </div>
  )
}
