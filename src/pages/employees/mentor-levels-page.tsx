import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, ChevronLeft, ChevronRight, Star } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { months, mentorLevelRows } from "./mock-data"
import { levelColor } from "./badges"

export function MentorLevelsPage() {
  const navigate = useNavigate()
  const [year, setYear] = useState(2024)

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

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg border border-input bg-card px-2 py-1.5">
            <button
              onClick={() => setYear((y) => y - 1)}
              className="rounded p-1 hover:bg-accent"
              aria-label="Previous year"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="min-w-[90px] text-center text-sm font-medium">{year} year</span>
            <button
              onClick={() => setYear((y) => y + 1)}
              className="rounded p-1 hover:bg-accent"
              aria-label="Next year"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
          <Button size="lg">
            <Star /> Levels
          </Button>
        </div>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 z-10 bg-card px-5 py-4 text-left font-semibold text-muted-foreground">
                FULL NAME
              </th>
              {months.map((m) => (
                <th key={m} className="px-3 py-4 text-center font-semibold">
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mentorLevelRows.map((row) => (
              <tr key={row.id} className="border-b border-border/60 last:border-0">
                <td className="sticky left-0 z-10 bg-card px-5 py-4 font-medium whitespace-nowrap">
                  {row.fullName}
                </td>
                {row.levels.map((level, i) => (
                  <td key={i} className="px-3 py-4 text-center whitespace-nowrap">
                    {level && (
                      <span className={cn("text-sm font-semibold", levelColor(level))}>
                        {level}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
