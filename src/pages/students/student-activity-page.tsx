import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, ArrowRight, ArrowUp, Bed, BookOpen, Bot, Brain, ThumbsDown, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ALL, FilterSelect } from "@/components/shared/filter-select"
import { SearchInput } from "@/components/shared/search-input"
import { StatCard } from "@/components/shared/stat-card"
import {
  useGetGroupStatsQuery,
  useGetGroupsQuery,
  useGetStudentActivityQuery,
} from "@/store/services"

const tagIcons: Record<string, LucideIcon> = {
  "Black list": Bed,
  Kettle: ThumbsDown,
  Advanced: BookOpen,
  Handsome: Brain,
  ChatGPT: Bot,
}

export function StudentActivityPage() {
  const [search, setSearch] = useState("")
  const [group, setGroup] = useState(ALL)
  const [category, setCategory] = useState(ALL)
  const [from, setFrom] = useState("2023-06-15")
  const [to, setTo] = useState("2023-07-15")
  const [sortDesc, setSortDesc] = useState(true)

  const { data: stats } = useGetGroupStatsQuery()
  const { data: groups } = useGetGroupsQuery({ limit: 50 })
  const { data, isLoading } = useGetStudentActivityQuery({
    search,
    limit: 20,
    group_id: group === ALL ? undefined : Number(group),
    category: category === ALL ? undefined : category,
    from,
    to,
  })

  const rows = [...(data?.data ?? [])].sort((a, b) =>
    sortDesc ? b.points - a.points : a.points - b.points
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/students" aria-label="Back to students">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Student activity</h1>
        </div>
        <div className="flex items-end gap-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">From</Label>
            <Input type="date" className="w-40" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">To</Label>
            <Input type="date" className="w-40" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {(stats?.data ?? []).map((stat) => (
          <StatCard
            key={stat.label}
            value={stat.count}
            label={stat.label}
            color={stat.color}
            icon={tagIcons[stat.label] ?? BookOpen}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name" />
        <FilterSelect
          placeholder="All group"
          value={group}
          onChange={setGroup}
          options={(groups?.data ?? []).map((g) => ({ value: String(g.id), label: g.name }))}
        />
        <FilterSelect
          placeholder="All category"
          value={category}
          onChange={setCategory}
          options={(stats?.data ?? []).map((s) => ({ value: s.label, label: s.label }))}
        />
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full name</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>
                <button
                  type="button"
                  onClick={() => setSortDesc((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 uppercase hover:text-primary"
                >
                  Points
                  <ArrowUp className={sortDesc ? "size-3.5" : "size-3.5 rotate-180"} />
                </button>
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Absence</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {rows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">
                  {index + 1}. {row.full_name}
                </TableCell>
                <TableCell>{row.group}</TableCell>
                <TableCell>{row.points}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.absence}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" aria-label="Open student">
                    <ArrowRight className="size-4 text-primary" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
