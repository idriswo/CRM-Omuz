import { useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  Bed,
  Bot,
  Brain,
  BookOpen,
  ClipboardList,
  Pencil,
  Plus,
  Send,
  ThumbsDown,
  Trash2,
  type LucideIcon,
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
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { GroupFormDialog } from "./group-form-dialog"
import { ALL, FilterSelect } from "@/components/shared/filter-select"
import { SearchInput } from "@/components/shared/search-input"
import { ViewToggle, type ViewMode } from "@/components/shared/view-toggle"
import { usePersistedState } from "@/hooks/use-persisted-state"
import {
  useDeleteGroupMutation,
  useGetBranchesQuery,
  useGetGroupStatsQuery,
  useGetGroupsQuery,
  type Group,
  type GroupStatus,
} from "@/store/services"

const tagIcons: Record<string, LucideIcon> = {
  "Black list": Bed,
  Kettle: ThumbsDown,
  Advanced: BookOpen,
  Handsome: Brain,
  ChatGPT: Bot,
}

/** Red once the group is short of the required headcount, green when it is met. */
function seatsVariant(group: Group) {
  return group.required_students >= group.capacity ? "success" : "destructive"
}

function GroupCard({ group, onEdit }: { group: Group; onEdit: () => void }) {
  return (
    <Card className="gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-lg font-bold">{group.name}</p>
          <p className="text-sm text-muted-foreground">
            {group.start_date} - {group.end_date}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <Badge variant={seatsVariant(group)} className="px-3">
            {group.required_students}/{group.capacity}
          </Badge>
          <span className="mt-1 text-xs text-muted-foreground">Students</span>
        </div>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge variant="success">
            {group.passing_students}/{group.capacity}
          </Badge>
          <p className="mt-1 text-xs text-muted-foreground">Passing students</p>
        </div>
        <div className="text-right text-sm">
          <p className="font-semibold">{group.days}</p>
          <p className="text-muted-foreground">
            {group.duration} ({group.time})
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" className="bg-accent text-primary" asChild>
          <Link to={`/groups/${group.id}/journal`}>
            <ClipboardList className="size-4" /> Journal
          </Link>
        </Button>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Send message">
            <Send className="size-4 text-sky-500" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Edit group" onClick={onEdit}>
            <Pencil className="size-4 text-primary" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

export function GroupsPage() {
  const [view, setView] = usePersistedState<ViewMode>("groups:view", "list")
  const [search, setSearch] = useState("")
  const [branch, setBranch] = useState(ALL)
  const [status, setStatus] = useState(ALL)
  const [pendingDelete, setPendingDelete] = useState<Group | null>(null)
  const [editing, setEditing] = useState<Group | null>(null)
  const [creating, setCreating] = useState(false)

  const [deleteGroup] = useDeleteGroupMutation()
  const { data: stats } = useGetGroupStatsQuery()
  const { data: branches } = useGetBranchesQuery()
  const { data, isLoading } = useGetGroupsQuery({
    search,
    limit: 12,
    branch_id: branch === ALL ? undefined : Number(branch),
    status: status === ALL ? undefined : (status as GroupStatus),
  })

  const groups = data?.data ?? []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Groups</h1>
        <Button size="lg" onClick={() => setCreating(true)}>
          <Plus /> Add new
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {(stats?.data ?? []).map((stat) => {
          const Icon = tagIcons[stat.label] ?? BookOpen
          return (
            <Card
              key={stat.label}
              className="flex flex-col items-center justify-center gap-1 py-5"
            >
              <span className="text-3xl font-bold" style={{ color: stat.color }}>
                {stat.count}
              </span>
              <span className="flex items-center gap-2 text-sm font-medium">
                <Icon className="size-4" />
                {stat.label}
              </span>
            </Card>
          )
        })}
        <Card className="p-0">
          <Link
            to="/students/activity"
            className="flex h-full flex-col items-center justify-center gap-1 py-5"
          >
            <ArrowRight className="size-6 text-primary" />
            <span className="text-sm font-semibold text-primary">See more</span>
          </Link>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search group" />
        <FilterSelect
          placeholder="Branch"
          value={branch}
          onChange={setBranch}
          options={(branches?.data ?? []).map((b) => ({ value: String(b.id), label: b.title }))}
        />
        <FilterSelect
          placeholder="Status"
          value={status}
          onChange={setStatus}
          options={[
            { value: "Started", label: "Started" },
            { value: "Pending", label: "Pending" },
            { value: "Finished", label: "Finished" },
          ]}
        />
        <div className="ml-auto">
          <ViewToggle value={view} onChange={setView} />
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} onEdit={() => setEditing(group)} />
          ))}
        </div>
      ) : (
        <Card className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Required students</TableHead>
                <TableHead>Passing students</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Journal</TableHead>
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
              {groups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell>
                    <Link to={`/groups/${group.id}`} className="font-semibold hover:text-primary">
                      {group.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {group.start_date} - {group.end_date}
                    </p>
                  </TableCell>
                  <TableCell>{group.duration}</TableCell>
                  <TableCell>
                    <Badge variant={seatsVariant(group)}>
                      {group.required_students}/{group.capacity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {group.passing_students}/{group.capacity}
                    </Badge>
                  </TableCell>
                  <TableCell>{group.branch}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        group.status === "Started"
                          ? "success"
                          : group.status === "Finished"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {group.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="bg-accent" asChild>
                      <Link to={`/groups/${group.id}/journal`} aria-label="Open journal">
                        <ClipboardList className="size-4 text-primary" />
                      </Link>
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className={cn("flex items-center justify-end gap-1")}>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edit group"
                        onClick={() => setEditing(group)}
                      >
                        <Pencil className="size-4 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete group"
                        onClick={() => setPendingDelete(group)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <GroupFormDialog open={creating} onOpenChange={setCreating} />
      <GroupFormDialog
        group={editing}
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Do you really want to delete group?"
        onConfirm={() => {
          if (pendingDelete) deleteGroup(pendingDelete.id)
        }}
      />
    </div>
  )
}
