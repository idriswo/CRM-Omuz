import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, ArrowRight, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ALL, FilterSelect } from "@/components/shared/filter-select"
import { MonthlyAreaChart } from "@/components/shared/monthly-area-chart"
import { SearchInput } from "@/components/shared/search-input"
import {
  useGetEnrolledChartQuery,
  useGetEnrolledQuery,
  useGetGroupsQuery,
} from "@/store/services"

export function EnrollStudentsPage() {
  const [year, setYear] = useState(2024)
  const [search, setSearch] = useState("")
  const [group, setGroup] = useState(ALL)
  const [month, setMonth] = useState("2024-06")

  const { data: chart } = useGetEnrolledChartQuery({ year })
  const { data: groups } = useGetGroupsQuery({ limit: 50 })
  const { data, isLoading } = useGetEnrolledQuery({
    search,
    limit: 12,
    group_id: group === ALL ? undefined : Number(group),
  })

  return (
    <div className="flex flex-col gap-6">
      <MonthlyAreaChart
        title="Enroll students"
        seriesLabel="Enroll students"
        data={chart?.data ?? []}
        year={year}
        onYearChange={setYear}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/students" aria-label="Back to students">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Enroll students</h1>
        </div>
        <Button variant="outline" size="lg" className="text-primary">
          <Upload /> Export
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name" />
        <FilterSelect
          placeholder="Group"
          value={group}
          onChange={setGroup}
          options={(groups?.data ?? []).map((g) => ({ value: String(g.id), label: g.name }))}
        />
        <Input
          type="month"
          className="w-44"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full name</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Mentor</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Date</TableHead>
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
            {data?.data?.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.full_name}</TableCell>
                <TableCell>{row.group}</TableCell>
                <TableCell>{row.mentor}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.date}</TableCell>
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
