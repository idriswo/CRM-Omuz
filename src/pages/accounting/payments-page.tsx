import { useState } from "react"
import { Search, Upload, Plus, Pencil, Trash2 } from "lucide-react"

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
import { FilterField, DateField } from "./components/filter-field"
import { SelectFilterField } from "./components/select-filter-field"
import { useGetPaymentsQuery } from "@/store/services"

const groupOptions = [
  { value: "all", label: "All groups" },
  { value: "C# 5 June", label: "C# 5 June" },
  { value: "React", label: "React" },
  { value: "HTML June", label: "HTML June" },
  { value: "Olympiad 4", label: "Olympiad 4" },
  { value: "C# 2 August", label: "C# 2 August" },
]

const branchOptions = [
  { value: "all", label: "All branches" },
  { value: "Sadbarg", label: "Sadbarg" },
  { value: "Profsous", label: "Profsous" },
]

const statusOptions = [
  { value: "all", label: "All status" },
  { value: "active", label: "Active" },
  { value: "prepayment", label: "Prepayment" },
]

export function PaymentsPage() {
  const [search, setSearch] = useState("")
  const [group, setGroup] = useState("all")
  const [branch, setBranch] = useState("all")
  const [status, setStatus] = useState("all")
  const [date, setDate] = useState("July 2023")

  const { data, isLoading } = useGetPaymentsQuery({
    search,
    group_id: group,
    branch_id: branch,
    status,
  })

  return (
    <div className="flex flex-col gap-6">
      <AccountingHeader
        title="Payments"
        actions={
          <>
            <Button variant="outline" size="lg">
              <Upload /> EXPORT
            </Button>
            <Button size="lg">
              <Plus /> PREPAYMENT
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-5 gap-4">
        <FilterField label="Search">
          <Search className="mr-2 size-4 shrink-0 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search payment"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </FilterField>
        <SelectFilterField label="Groups" value={group} onValueChange={setGroup} options={groupOptions} />
        <SelectFilterField label="Branch" value={branch} onValueChange={setBranch} options={branchOptions} />
        <SelectFilterField label="Status" value={status} onValueChange={setStatus} options={statusOptions} />
        <DateField label="Date" value={date} onChange={setDate} />
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Groups</TableHead>
              <TableHead>Branch</TableHead>
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
            {data?.data.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="font-medium">{p.full_name}</div>
                  <div className="text-xs text-muted-foreground">{p.phone}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={p.discount ? "text-destructive" : ""}>{p.amount}</span>
                    {p.discount > 0 && (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                        -{p.discount}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{p.paid}</TableCell>
                <TableCell>{p.date}</TableCell>
                <TableCell>{p.group}</TableCell>
                <TableCell>{p.branch}</TableCell>
                <TableCell>
                  <Badge variant={p.status === "Active" ? "success" : "outline"}>{p.status}</Badge>
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
