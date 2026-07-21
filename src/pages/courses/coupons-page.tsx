import { useState } from "react"
import { Calendar, Plus, SquarePen, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { coupons as initialCoupons, leadCourses, type Coupon } from "./mock-data"
import { CouponLogo } from "./course-logo"

export function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons)

  const toggle = (id: number) =>
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Coupons</h1>
        <Button size="lg">
          <Plus /> ADD NEW
        </Button>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Course</label>
          <Select defaultValue="all">
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All courses</SelectItem>
              {leadCourses.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Date</label>
          <div className="relative">
            <Input defaultValue="April 9, 2024" className="w-52 pr-9" />
            <Calendar className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {coupons.map((coupon) => (
          <CouponCard key={coupon.id} coupon={coupon} onToggle={() => toggle(coupon.id)} />
        ))}
      </div>
    </div>
  )
}

function CouponCard({ coupon, onToggle }: { coupon: Coupon; onToggle: () => void }) {
  return (
    <Card className="gap-0 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <CouponLogo logo={coupon.logo} />
          <div>
            <h3 className="font-bold">{coupon.course}</h3>
            <p className="text-xs text-muted-foreground">
              {coupon.from} - {coupon.to}
            </p>
          </div>
        </div>
        <p className="text-lg font-bold">{coupon.price} s</p>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Edit">
            <SquarePen className="size-4 text-primary" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Delete">
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
        <Switch checked={coupon.active} onCheckedChange={onToggle} />
      </div>
    </Card>
  )
}
