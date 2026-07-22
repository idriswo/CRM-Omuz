import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ALL, FilterSelect } from "@/components/shared/filter-select"
import { GroupAccordion } from "@/components/shared/group-accordion"
import { MonthlyAreaChart } from "@/components/shared/monthly-area-chart"
import { SearchInput } from "@/components/shared/search-input"
import {
  useGetGroupsQuery,
  useGetLeftCourseGroupsQuery,
  useGetLeftCoursesChartQuery,
  useGetLeftCoursesQuery,
} from "@/store/services"

export function LeftCoursesPage() {
  const [tab, setTab] = useState("students")
  const [year, setYear] = useState(2024)
  const [search, setSearch] = useState("")
  const [group, setGroup] = useState(ALL)
  const [date, setDate] = useState("2024-08-28")

  const { data: chart } = useGetLeftCoursesChartQuery({ year })
  const { data: groups } = useGetGroupsQuery({ limit: 50 })
  const { data, isLoading } = useGetLeftCoursesQuery(
    {
      search,
      limit: 12,
      group_id: group === ALL ? undefined : Number(group),
    },
    { skip: tab !== "students" }
  )
  const { data: grouped, isLoading: groupsLoading } = useGetLeftCourseGroupsQuery(
    { search },
    { skip: tab !== "groups" }
  )

  return (
    <div className="flex flex-col gap-6">
      <MonthlyAreaChart
        title="Left courses"
        seriesLabel="Left courses"
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
          <h1 className="text-3xl font-bold">Left courses</h1>
        </div>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name" />
        {tab === "students" && (
          <FilterSelect
            placeholder="Group"
            value={group}
            onChange={setGroup}
            options={(groups?.data ?? []).map((g) => ({ value: String(g.id), label: g.name }))}
          />
        )}
        <Input type="date" className="w-44" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      {tab === "groups" ? (
        <GroupAccordion
          groups={grouped?.data ?? []}
          isLoading={groupsLoading}
          columns={["Full name", "Mentor", "Phone", "Date", "Reason", "Action"]}
          renderRow={(row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.full_name}</TableCell>
              <TableCell>{row.mentor}</TableCell>
              <TableCell>{row.phone}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell className="whitespace-normal">{row.reason}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" aria-label="Open student">
                  <ArrowRight className="size-4 text-primary" />
                </Button>
              </TableCell>
            </TableRow>
          )}
        />
      ) : (
      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full name</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Mentor</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
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
                <TableCell className="whitespace-normal">{row.reason}</TableCell>
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
      )}
    </div>
  )
}
