import { UserRound } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useGetMyGroupmatesQuery } from "@/store/services"

export function StudentGroupmatesPage() {
  const { data } = useGetMyGroupmatesQuery()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Classmates</h1>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full name</TableHead>
              <TableHead>Group</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((mate) => (
              <TableRow key={mate.id}>
                <TableCell className="flex items-center gap-2 font-medium">
                  <UserRound className="size-4 text-muted-foreground" />
                  {mate.full_name}
                </TableCell>
                <TableCell>{mate.group}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
