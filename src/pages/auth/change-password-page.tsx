import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { KeyRound } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useChangePasswordMutation } from "@/store/services"
import { apiErrorMessage } from "@/lib/api-error"
import { clearSession } from "@/lib/auth"

export function ChangePasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const [changePassword, { isLoading }] = useChangePasswordMutation()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const form = new FormData(e.currentTarget)
    const oldPassword = String(form.get("old_password"))
    const newPassword = String(form.get("new_password"))
    const confirmPassword = String(form.get("confirm_password"))

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    try {
      await changePassword({ old_password: oldPassword, new_password: newPassword }).unwrap()
      // The backend revokes old tokens on password change, so the user must log in again.
      clearSession()
      navigate("/login", { replace: true })
    } catch (err) {
      setError(apiErrorMessage(err, { fallback: "Could not change the password." }))
    }
  }

  return (
    <Card className="w-full max-w-md p-8 shadow-md">
      <div className="mx-auto mb-2 flex size-20 items-center justify-center rounded-full bg-accent">
        <KeyRound className="size-9 text-primary" />
      </div>
      <div className="mb-4 text-center">
        <h1 className="text-xl font-bold">Change your password</h1>
        <p className="text-sm text-muted-foreground">
          Your password was set by an administrator. Choose a new one to continue.
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="old_password">Current password</Label>
          <Input id="old_password" name="old_password" type="password" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="new_password">New password</Label>
          <Input id="new_password" name="new_password" type="password" minLength={8} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirm_password">Confirm new password</Label>
          <Input id="confirm_password" name="confirm_password" type="password" minLength={8} required />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" size="lg" className="mt-2" disabled={isLoading}>
          {isLoading ? "Saving..." : "Change password"}
        </Button>
      </form>
    </Card>
  )
}
