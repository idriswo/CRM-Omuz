import { useState } from "react"
import { RefreshCw, Search, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AccountingHeader } from "./components/accounting-header"
import { DateField, FilterField } from "./components/filter-field"
import { useGetSalaryQuery } from "@/store/services"

export function SalaryPage() {
  const [search, setSearch] = useState("")
  const [month, setMonth] = useState("All month")

  const { data, isLoading, refetch } = useGetSalaryQuery({
    search,
    date: month === "All month" ? "all" : month,
  })

  return (
    <div className="flex flex-col gap-6">
      <AccountingHeader
        title="Salary"
        actions={
          <Button size="lg" onClick={() => refetch()}>
            <RefreshCw /> REFRESH
          </Button>
        }
      />

      <div className="grid grid-cols-4 gap-4">
        <FilterField label="Search">
          <Search className="mr-2 size-4 shrink-0 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </FilterField>
        <DateField label="Month" value={month} onChange={setMonth} />
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full name</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Prepaid</TableHead>
              <TableHead>Remaining</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Month</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {data?.data?.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.full_name}</TableCell>
                <TableCell>{s.total}</TableCell>
                <TableCell>{s.prepaid}</TableCell>
                <TableCell>{s.remaining}</TableCell>
                <TableCell>{s.paid}</TableCell>
                <TableCell>{s.month}</TableCell>
                <TableCell>
                  <Badge variant={s.status === "Active" ? "success" : "destructive"}>{s.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" aria-label="Edit">
                      <Pencil className="size-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Delete">
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
