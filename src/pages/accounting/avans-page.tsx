import { useState } from "react"
import { Search, Check, X } from "lucide-react"

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
import { AccountingHeader } from "./components/accounting-header"
import { DateField, FilterField } from "./components/filter-field"
import { SelectFilterField } from "./components/select-filter-field"
import { useGetAvansQuery, useUpdateAvansMutation } from "@/store/services"

const statusOptions = [
  { value: "all", label: "All status" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "denied", label: "Denied" },
]

export function AvansPage() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [date, setDate] = useState("April 2024")

  const { data, isLoading } = useGetAvansQuery({ search, status })
  const [updateAvans] = useUpdateAvansMutation()

  return (
    <div className="flex flex-col gap-6">
      <AccountingHeader title="Avans" />

      <div className="grid grid-cols-3 gap-4">
        <FilterField label="Search">
          <Search className="mr-2 size-4 shrink-0 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
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
              <TableHead>Month</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {data?.data?.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.full_name}</TableCell>
                <TableCell>{a.month}</TableCell>
                <TableCell>{a.amount}</TableCell>
                <TableCell className="max-w-xs whitespace-normal text-muted-foreground">{a.description}</TableCell>
                <TableCell className="text-right">
                  {a.status === "pending" && (
                    <div className="flex justify-end gap-2">
                      <Button size="sm" onClick={() => updateAvans({ id: a.id, data: { status: "approved" } })}>
                        Done
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        aria-label="Deny"
                        onClick={() => updateAvans({ id: a.id, data: { status: "denied" } })}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  )}
                  {a.status === "approved" && (
                    <span className="inline-flex items-center gap-1.5 font-medium text-success">
                      <Check className="size-4" /> Approved
                    </span>
                  )}
                  {a.status === "denied" && (
                    <span className="inline-flex items-center gap-1.5 font-medium text-destructive">
                      <X className="size-4" /> Denied
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
