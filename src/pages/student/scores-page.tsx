import { CheckCircle2, XCircle } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useGetMyScoresQuery } from "@/store/services"

export function StudentScoresPage() {
  const { data } = useGetMyScoresQuery()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Scores & attendance</h1>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Comment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((entry, i) => (
              <TableRow key={i}>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.group}</TableCell>
                <TableCell>
                  {entry.attendance ? (
                    <CheckCircle2 className="size-4 text-success" />
                  ) : (
                    <XCircle className="size-4 text-destructive" />
                  )}
                </TableCell>
                <TableCell>{entry.score ?? "-"}</TableCell>
                <TableCell className="text-muted-foreground">{entry.comment ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
