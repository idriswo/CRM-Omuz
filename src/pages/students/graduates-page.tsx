import { useState } from "react"
import {
  Briefcase,
  BookOpen,
  GraduationCap,
  Laptop,
  Pencil,
  PersonStanding,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Avatar } from "@/components/shared/avatar"
import { ALL, FilterSelect } from "@/components/shared/filter-select"
import { GroupAccordion } from "@/components/shared/group-accordion"
import { SearchInput } from "@/components/shared/search-input"
import { StatCard } from "@/components/shared/stat-card"
import {
  useGetGraduateGroupsQuery,
  useGetGraduatesQuery,
  useGetGraduatesStatsQuery,
  useGetGroupsQuery,
  useUpdateGraduateMutation,
  type Graduate,
  type GraduateTag,
} from "@/store/services"

const tagColors: Record<GraduateTag, string> = {
  OpenToWork: "text-primary",
  Work: "text-success",
  Freelancer: "text-fuchsia-500",
  Entrepreneur: "text-amber-500",
  FurtherEducation: "text-orange-500",
}

function GraduateName({ graduate }: { graduate: Graduate }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar src={graduate.photo} alt={graduate.full_name} />
      <div>
        <p className="font-medium">{graduate.full_name}</p>
        <p className={`text-sm font-semibold ${tagColors[graduate.tag]}`}>#{graduate.tag}</p>
      </div>
    </div>
  )
}

export function GraduatesPage() {
  const [tab, setTab] = useState("students")
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState(ALL)
  const [course, setCourse] = useState(ALL)
  const [group, setGroup] = useState(ALL)
  const [date, setDate] = useState("2024-09-01")

  const { data: stats } = useGetGraduatesStatsQuery()
  const { data: groups } = useGetGroupsQuery({ limit: 50 })
  const { data, isLoading } = useGetGraduatesQuery(
    {
      search,
      limit: 12,
      status: status === ALL ? undefined : status,
      group_id: group === ALL ? undefined : Number(group),
    },
    { skip: tab !== "students" }
  )
  const { data: grouped, isLoading: groupsLoading } = useGetGraduateGroupsQuery(
    { search, status: status === ALL ? undefined : status },
    { skip: tab !== "groups" }
  )
  const [updateGraduate] = useUpdateGraduateMutation()

  const certificateCell = (graduate: Graduate) => (
    <Checkbox
      checked={graduate.has_certificate}
      aria-label="Certificate issued"
      onCheckedChange={(checked) =>
        updateGraduate({ id: graduate.id, data: { has_certificate: checked === true } })
      }
    />
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-5">
        <StatCard value={stats?.graduates ?? 0} label="Graduates" color="#4c3ce8" icon={GraduationCap} />
        <StatCard value={stats?.employed ?? 0} label="Employed" color="#22c55e" icon={Briefcase} />
        <StatCard value={stats?.open_to_work ?? 0} label="Open to work" color="#22b8cf" icon={PersonStanding} />
        <StatCard value={stats?.freelancer ?? 0} label="Freelancer" color="#a855f7" icon={Laptop} />
        <StatCard value={stats?.further_edu ?? 0} label="Further edu" color="#fa541c" icon={BookOpen} />
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Graduates</h1>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name, serial" />
        <FilterSelect
          placeholder="Status"
          value={status}
          onChange={setStatus}
          options={[
            { value: "OpenToWork", label: "Open to work" },
            { value: "Work", label: "Work" },
            { value: "Freelancer", label: "Freelancer" },
            { value: "Entrepreneur", label: "Entrepreneur" },
            { value: "FurtherEducation", label: "Further education" },
          ]}
        />
        <FilterSelect
          placeholder="Course"
          value={course}
          onChange={setCourse}
          options={[...new Set((groups?.data ?? []).map((g) => g.course))].map((c) => ({
            value: c,
            label: c,
          }))}
        />
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
          columns={["Full name", "Age", "Date of issue", "Work place", "Serial", "Certificate", "Action"]}
          renderRow={(graduate) => (
            <TableRow key={graduate.id}>
              <TableCell>
                <GraduateName graduate={graduate} />
              </TableCell>
              <TableCell>{graduate.age}</TableCell>
              <TableCell>{graduate.date_of_issue}</TableCell>
              <TableCell>{graduate.work_place}</TableCell>
              <TableCell>{graduate.serial}</TableCell>
              <TableCell>{certificateCell(graduate)}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" aria-label="Edit graduate">
                  <Pencil className="size-4 text-primary" />
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
                <TableHead>Age</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Date of issue</TableHead>
                <TableHead>Work place</TableHead>
                <TableHead>Serial</TableHead>
                <TableHead>Certificate</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              )}
              {data?.data.map((graduate) => (
                <TableRow key={graduate.id}>
                  <TableCell>
                    <GraduateName graduate={graduate} />
                  </TableCell>
                  <TableCell>{graduate.age}</TableCell>
                  <TableCell>{graduate.group}</TableCell>
                  <TableCell>{graduate.date_of_issue}</TableCell>
                  <TableCell>{graduate.work_place}</TableCell>
                  <TableCell>{graduate.serial}</TableCell>
                  <TableCell>{certificateCell(graduate)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" aria-label="Edit graduate">
                      <Pencil className="size-4 text-primary" />
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
