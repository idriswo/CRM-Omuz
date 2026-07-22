import { useMemo, useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, Ticket } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useCreateCouponMutation,
  useGetCouponsQuery,
  useGetLeadsQuery,
  type Coupon,
} from "@/store/services"

const NO_LEAD = "none"

export function CouponsPage() {
  const navigate = useNavigate()
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data: coupons, isLoading, isError } = useGetCouponsQuery()
  const { data: leads } = useGetLeadsQuery({ limit: 100 })

  const leadNames = useMemo(
    () => new Map((leads?.data ?? []).map((l) => [l.id, l.full_name])),
    [leads]
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/courses/leads")}
            className="rounded-md p-1 hover:bg-accent"
            aria-label="Back"
          >
            <ArrowLeft className="size-6" />
          </button>
          <h1 className="text-3xl font-bold">Coupons</h1>
        </div>
        <Button size="lg" onClick={() => setDialogOpen(true)}>
          <Plus /> ADD NEW
        </Button>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading coupons…</p>}
      {isError && <p className="text-sm text-destructive">Could not load coupons.</p>}
      {!isLoading && !isError && (coupons ?? []).length === 0 && (
        <p className="text-sm text-muted-foreground">No coupons yet.</p>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {(coupons ?? []).map((coupon) => (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            leadName={coupon.lead_id ? leadNames.get(coupon.lead_id) : undefined}
          />
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        The API's coupon record is <code>{"{ code, discount, lead_id }"}</code> only — editing,
        deleting, an active switch, a course link and a validity range all need new endpoints and
        columns.
      </p>

      {/* Keyed so a half-filled, abandoned form is not still there next time. */}
      <CreateCouponDialog
        key={dialogOpen ? "open" : "closed"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}

function CouponCard({ coupon, leadName }: { coupon: Coupon; leadName?: string }) {
  return (
    <Card className="gap-0 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Ticket className="size-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-bold">{coupon.code}</h3>
            <p className="text-xs text-muted-foreground">
              Created {new Date(coupon.created_at).toLocaleDateString("en-GB")}
            </p>
          </div>
        </div>
        <p className="text-lg font-bold text-green-600 dark:text-green-400">−{coupon.discount}</p>
      </div>

      <hr className="my-4 border-border" />

      <p className="text-sm text-muted-foreground">
        Lead: <span className="font-medium text-foreground">{leadName ?? "—"}</span>
      </p>
    </Card>
  )
}

function CreateCouponDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { data: leads } = useGetLeadsQuery({ limit: 100 })
  const [createCoupon, { isLoading }] = useCreateCouponMutation()

  const [code, setCode] = useState("")
  const [discount, setDiscount] = useState("")
  const [leadId, setLeadId] = useState(NO_LEAD)
  const [failed, setFailed] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFailed(false)
    try {
      await createCoupon({
        code: code.trim(),
        discount: Number(discount) || 0,
        lead_id: leadId === NO_LEAD ? null : Number(leadId),
      }).unwrap()
      setCode("")
      setDiscount("")
      setLeadId(NO_LEAD)
      onOpenChange(false)
    } catch {
      setFailed(true)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add new coupon</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="coupon-code">Code</Label>
            <Input
              id="coupon-code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="SUMMER25"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="coupon-discount">Discount</Label>
            <Input
              id="coupon-discount"
              type="number"
              min={0}
              required
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Lead</Label>
            <Select value={leadId} onValueChange={setLeadId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Lead" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_LEAD}>Not linked</SelectItem>
                {(leads?.data ?? []).map((l) => (
                  <SelectItem key={l.id} value={String(l.id)}>
                    {l.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {failed && (
            <p className="text-sm text-destructive">
              Could not create the coupon — the code must be unique.
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
