import { Fragment, useState } from "react"
import { ChevronDown, Upload } from "lucide-react"

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
import { DateField } from "./components/filter-field"
import { SelectFilterField } from "./components/select-filter-field"
import { cn } from "@/lib/utils"
import { useGetExpensesQuery } from "@/store/services"

const categoryOptions = [
  { value: "all", label: "All category" },
  { value: "Tax", label: "Tax" },
  { value: "Office expenses", label: "Office expenses" },
  { value: "Marketing", label: "Marketing" },
  { value: "Employees", label: "Employees" },
]

const branchOptions = [
  { value: "all", label: "All branches" },
  { value: "Sadbarg", label: "Sadbarg" },
  { value: "Profsous", label: "Profsous" },
]

export function ExpensesPage() {
  const [category, setCategory] = useState("all")
  const [branch, setBranch] = useState("all")
  const [date, setDate] = useState("July 2023")
  const [openRows, setOpenRows] = useState<number[]>([1])

  const { data, isLoading } = useGetExpensesQuery({ category, branch_id: branch })

  const toggleRow = (id: number) =>
    setOpenRows((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]))

  return (
    <div className="flex flex-col gap-6">
      <AccountingHeader
        title="Expenses"
        actions={
          <Button variant="outline" size="lg">
            <Upload /> EXPORT
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-4">
        <SelectFilterField label="Category" value={category} onValueChange={setCategory} options={categoryOptions} />
        <SelectFilterField label="Branch" value={branch} onValueChange={setBranch} options={branchOptions} />
        <DateField label="Date" value={date} onChange={setDate} />
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10" />
              <TableHead>Full name</TableHead>
              <TableHead>Total payment</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {data?.data?.map((row) => {
              const open = openRows.includes(row.id)
              return (
                <Fragment key={row.id}>
                  <TableRow
                    className={row.children ? "cursor-pointer" : ""}
                    onClick={() => row.children && toggleRow(row.id)}
                  >
                    <TableCell>
                      {row.children && (
                        <ChevronDown className={cn("size-4 text-primary transition-transform", open && "rotate-180")} />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>{row.total_payment}</TableCell>
                    <TableCell>{row.recipient}</TableCell>
                    <TableCell>{row.branch}</TableCell>
                    <TableCell>
                      <Badge variant={row.status === "Active" ? "success" : "outline"}>{row.status}</Badge>
                    </TableCell>
                  </TableRow>
                  {open &&
                    row.children?.map((child) => (
                      <TableRow key={`${row.id}-${child.id}`}>
                        <TableCell />
                        <TableCell className="pl-8 text-muted-foreground">{child.name}</TableCell>
                        <TableCell>{child.total_payment}</TableCell>
                        <TableCell>{child.recipient}</TableCell>
                        <TableCell>{child.branch}</TableCell>
                        <TableCell>
                          <Badge variant={child.status === "Active" ? "success" : "outline"}>{child.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </Fragment>
              )
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
