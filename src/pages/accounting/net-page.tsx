import { useState } from "react"
import { Upload } from "lucide-react"

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
import { useGetNetQuery } from "@/store/services"

const categoryOptions = [
  { value: "all", label: "All category" },
  { value: "Student", label: "Student" },
  { value: "Mentor", label: "Mentor" },
  { value: "Income tax", label: "Income tax" },
]

export function NetPage() {
  const [category, setCategory] = useState("all")
  const [date, setDate] = useState("July 2023")

  const { data, isLoading } = useGetNetQuery({ category })

  return (
    <div className="flex flex-col gap-6">
      <AccountingHeader
        title="Net"
        actions={
          <Button variant="outline" size="lg">
            <Upload /> EXPORT
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-4">
        <SelectFilterField label="Category" value={category} onValueChange={setCategory} options={categoryOptions} />
        <DateField label="Date" value={date} onChange={setDate} />
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {data?.data.map((n) => (
              <TableRow key={n.id}>
                <TableCell className="font-medium">{n.full_name}</TableCell>
                <TableCell>{n.category}</TableCell>
                <TableCell>{n.date}</TableCell>
                <TableCell>
                  <Badge variant={n.amount >= 0 ? "success" : "destructive"}>
                    {n.amount >= 0 ? "+" : ""}
                    {n.amount}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
