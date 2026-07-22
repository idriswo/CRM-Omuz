import { useMemo, useState } from "react"
import {
  Briefcase,
  Building2,
  MapPin,
  Plus,
  SquarePen,
  Trash2,
  UserCheck2,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
import { ViewToggle, type ViewMode } from "@/components/shared/view-toggle"
import { companyColors, jobStatuses, jobTypes, jobs, type Job } from "./mock-data"

function CompanyMark({ company }: { company: string }) {
  const color = companyColors[company] ?? "var(--color-primary)"
  return (
    <span
      className="flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
      style={{ background: color }}
    >
      {company.charAt(0)}
    </span>
  )
}

function StatusBadge({ status }: { status: Job["status"] }) {
  return <Badge variant={status === "Open" ? "success" : "secondary"}>{status}</Badge>
}

function JobCard({ job }: { job: Job }) {
  return (
    <Card className="gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <CompanyMark company={job.company} />
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold">{job.title}</h3>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
              <Building2 className="size-3.5" /> {job.company}
            </p>
          </div>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{job.type}</Badge>
        <Badge variant="outline" className="gap-1">
          <MapPin className="size-3" /> {job.location}
        </Badge>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-muted/60 p-3">
        <div>
          <p className="text-xs text-muted-foreground">Salary</p>
          <p className="font-semibold">
            {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()} c
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Applicants</p>
          <p className="flex items-center gap-1 font-semibold">
            <Users className="size-3.5 text-primary" /> {job.applicants}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Posted {job.postedDaysAgo === 0 ? "today" : `${job.postedDaysAgo}d ago`}
        </span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Edit job">
            <SquarePen className="size-4 text-primary" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Delete job">
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

function JobTable({ rows }: { rows: Job[] }) {
  return (
    <Card className="p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Applicants</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                No vacancies match these filters.
              </TableCell>
            </TableRow>
          )}
          {rows.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">{job.title}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <CompanyMark company={job.company} />
                  {job.company}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{job.type}</TableCell>
              <TableCell className="text-muted-foreground">{job.location}</TableCell>
              <TableCell>
                {job.salaryMin.toLocaleString()}-{job.salaryMax.toLocaleString()} c
              </TableCell>
              <TableCell>{job.applicants}</TableCell>
              <TableCell>
                <StatusBadge status={job.status} />
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" aria-label="Edit job">
                    <SquarePen className="size-4 text-primary" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Delete job">
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

export function JobsPage() {
  const [view, setView] = useState<ViewMode>("grid")
  const [search, setSearch] = useState("")
  const [type, setType] = useState(ALL)
  const [status, setStatus] = useState(ALL)

  const filtered = useMemo(
    () =>
      jobs.filter(
        (j) =>
          (j.title.toLowerCase().includes(search.toLowerCase()) ||
            j.company.toLowerCase().includes(search.toLowerCase())) &&
          (type === ALL || j.type === type) &&
          (status === ALL || j.status === status)
      ),
    [search, type, status]
  )

  const openCount = jobs.filter((j) => j.status === "Open").length
  const totalApplicants = jobs.reduce((sum, j) => sum + j.applicants, 0)
  const partnerCount = new Set(jobs.map((j) => j.company)).size

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Jobs</h1>
        <Button size="lg">
          <Plus /> Add job
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard value={openCount} label="Open vacancies" color="var(--color-success)" icon={Briefcase} />
        <StatCard value={totalApplicants} label="Applicants" color="var(--color-primary)" icon={Users} />
        <StatCard value={partnerCount} label="Partner companies" color="#4c3ce8" icon={Building2} />
        <StatCard value={12} label="Placed this month" color="#f59e0b" icon={UserCheck2} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by position or company" />
        <FilterSelect
          placeholder="Type"
          value={type}
          onChange={setType}
          options={jobTypes.map((t) => ({ value: t, label: t }))}
        />
        <FilterSelect
          placeholder="Status"
          value={status}
          onChange={setStatus}
          options={jobStatuses.map((s) => ({ value: s, label: s }))}
        />
        <div className="ml-auto">
          <ViewToggle value={view} onChange={setView} />
        </div>
      </div>

      {view === "grid" ? (
        <div className={cn("grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3")}>
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <JobTable rows={filtered} />
      )}
    </div>
  )
}
