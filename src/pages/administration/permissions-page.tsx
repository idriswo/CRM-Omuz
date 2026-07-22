import { useState } from "react"
import { Search } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useGetPermissionsQuery, useUpdatePermissionMutation } from "@/store/services"

export function PermissionsPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const { data } = useGetPermissionsQuery({
    search,
    filter: filter === "all" ? undefined : filter,
  })
  const [updatePermission] = useUpdatePermissionMutation()

  const groups = Array.from(new Set(data?.data?.map((p) => p.group) ?? []))

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Permission</h1>

      <div className="flex gap-4">
        <div className="w-72">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="All permission" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All permission</SelectItem>
            {groups.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Permission</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((permission) => (
              <TableRow key={permission.id}>
                <TableCell className="font-medium">{permission.name}</TableCell>
                <TableCell className="text-right">
                  <Switch
                    checked={permission.enabled}
                    onCheckedChange={(enabled) =>
                      updatePermission({ id: permission.id, enabled })
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
