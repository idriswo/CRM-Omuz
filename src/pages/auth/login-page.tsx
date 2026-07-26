import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useLoginMutation } from "@/store/services"
import { homeRouteForRole, persistSession } from "@/lib/auth"
import { ForgotPasswordDialog } from "./forgot-password-dialog"

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const navigate = useNavigate()

  const [login, { isLoading: loggingIn, error: loginError }] = useLoginMutation()

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const res = await login({
      phone: String(form.get("phone")),
      password: String(form.get("password")),
    }).unwrap()
    const role = persistSession(res)
    navigate(homeRouteForRole(role))
  }

  return (
    <Card className="w-full max-w-md p-8 shadow-md">
      <form className="flex flex-col gap-4" onSubmit={handleLogin}>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" placeholder="Phone" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {loginError && (
          <p className="text-sm text-destructive">
            Phone or password is incorrect.
          </p>
        )}

        <Button type="submit" size="lg" className="mt-2" disabled={loggingIn}>
          {loggingIn ? "Logging in..." : "Log in"}
        </Button>
        <Button
          type="button"
          variant="link"
          className="mx-auto"
          onClick={() => setForgotPasswordOpen(true)}
        >
          Forgot password?
        </Button>
      </form>

      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
      />
    </Card>
  )
}
