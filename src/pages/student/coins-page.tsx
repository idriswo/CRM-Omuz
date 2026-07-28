import { Coins } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useGetMyCoinsQuery } from "@/store/services"

export function StudentCoinsPage() {
  const { data } = useGetMyCoinsQuery()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">My coins</h1>

      <Card className="flex-row items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-full bg-accent">
          <Coins className="size-7 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Balance</p>
          <p className="text-2xl font-bold">{data?.balance ?? 0}</p>
        </div>
      </Card>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.history?.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.date}</TableCell>
                <TableCell className={entry.amount >= 0 ? "text-success" : "text-destructive"}>
                  {entry.amount >= 0 ? `+${entry.amount}` : entry.amount}
                </TableCell>
                <TableCell>
                  <Badge variant={entry.type === "auto_weekly" ? "success" : "secondary"}>
                    {entry.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{entry.reason ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
