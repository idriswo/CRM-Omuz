import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { Eye, EyeOff } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { api } from "@/store/api"
import { useLoginMutation } from "@/store/services"
import { homeRouteForRole, persistSession } from "@/lib/auth"
import { ForgotPasswordDialog } from "./forgot-password-dialog"

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [login, { isLoading: loggingIn, error: loginError }] = useLoginMutation()

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const res = await login({
      email: String(form.get("email")),
      password: String(form.get("password")),
    }).unwrap()
    const role = persistSession(res)
    // Otherwise a login without a preceding logout (e.g. after a session expired)
    // keeps serving the previous account's cached queries.
    dispatch(api.util.resetApiState())
    navigate(homeRouteForRole(role))
  }

  return (
    <Card className="w-full max-w-md p-8 shadow-md">
      <form className="flex flex-col gap-4" onSubmit={handleLogin}>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="Email" required />
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
            Email or password is incorrect.
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
