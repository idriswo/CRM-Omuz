import { useState } from "react"
import { Search, Upload, Plus } from "lucide-react"

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
import { SelectFilterField } from "./components/select-filter-field"
import { useGetDebtorsQuery } from "@/store/services"

const statusOptions = [
  { value: "all", label: "All status" },
  { value: "inprogress", label: "Inprogress" },
  { value: "paid", label: "Paid" },
]

export function DebtorsPage() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [date, setDate] = useState("July 2023")

  const { data, isLoading } = useGetDebtorsQuery({ search, status })

  return (
    <div className="flex flex-col gap-6">
      <AccountingHeader
        title="Debtors"
        actions={
          <>
            <Button variant="outline" size="lg">
              <Upload /> EXPORT
            </Button>
            <Button size="lg">
              <Plus /> ADD NEW
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-3 gap-4">
        <FilterField label="Search">
          <Search className="mr-2 size-4 shrink-0 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search payment"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </FilterField>
        <SelectFilterField label="Status" value={status} onValueChange={setStatus} options={statusOptions} />
        <DateField label="Date" value={date} onChange={setDate} />
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full name</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Total debt amount</TableHead>
              <TableHead>Payment per month</TableHead>
              <TableHead>Total paid amount</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Status</TableHead>
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
            {data?.data.map((d, i) => (
              <TableRow key={d.id}>
                <TableCell className="font-medium">
                  {i + 1}. {d.full_name}
                </TableCell>
                <TableCell>{d.from_date}</TableCell>
                <TableCell>{d.to_date}</TableCell>
                <TableCell>{d.total_debt_amount}</TableCell>
                <TableCell>{d.payment_per_month}</TableCell>
                <TableCell>{d.total_paid_amount}</TableCell>
                <TableCell className="text-muted-foreground">{d.notes}</TableCell>
                <TableCell>
                  <Badge variant={d.status === "Paid" ? "success" : "outline"}>{d.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
