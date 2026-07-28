import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiErrorMessage } from "@/lib/api-error"
import { useCreateBranchMutation, useUpdateBranchMutation, type Branch } from "@/store/services"

/** Create / edit dialog backed by `POST /branches` and `PUT /branches/:id`.
 * All four fields are required — the backend answers 400 without them
 * (`title, city, district ва address ҳатмист`). */
export function BranchDialog({
  open,
  onOpenChange,
  branch,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  branch?: Branch | null
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{branch ? "Edit branch" : "Add new branch"}</DialogTitle>
        </DialogHeader>
        {/* Remount per target so the fields start from that branch's values. */}
        <BranchForm key={branch?.id ?? "new"} branch={branch} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

function BranchForm({ branch, onDone }: { branch?: Branch | null; onDone: () => void }) {
  const [createBranch, { isLoading: creating }] = useCreateBranchMutation()
  const [updateBranch, { isLoading: updating }] = useUpdateBranchMutation()

  const [title, setTitle] = useState(branch?.title ?? "")
  const [city, setCity] = useState(branch?.city ?? "")
  const [district, setDistrict] = useState(branch?.district ?? "")
  const [address, setAddress] = useState(branch?.address ?? "")
  const [error, setError] = useState("")

  const saving = creating || updating

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    const body = {
      title: title.trim(),
      city: city.trim(),
      district: district.trim(),
      address: address.trim(),
    }
    try {
      if (branch) await updateBranch({ id: branch.id, data: body }).unwrap()
      else await createBranch(body).unwrap()
      onDone()
    } catch (err) {
      setError(apiErrorMessage(err, { fallback: "Could not save the branch." }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="branch-title">Title</Label>
        <Input
          id="branch-title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sadbarg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="branch-city">City</Label>
          <Input
            id="branch-city"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Dushanbe"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="branch-district">District</Label>
          <Input
            id="branch-district"
            required
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            placeholder="Sino"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="branch-address">Address</Label>
        <Input
          id="branch-address"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Rudaki 25"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </DialogFooter>
    </form>
  )
}
