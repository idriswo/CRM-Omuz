import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { useLoginMutation, useRegisterMutation } from "@/store/services"
import { ForgotPasswordDialog } from "./forgot-password-dialog"

export function LoginPage() {
  const [tab, setTab] = useState("login")
  const [showPassword, setShowPassword] = useState(false)
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const navigate = useNavigate()

  const [login, { isLoading: loggingIn, error: loginError }] = useLoginMutation()
  const [register, { isLoading: registering, error: registerError }] =
    useRegisterMutation()

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const res = await login({
      phone: String(form.get("phone")),
      password: String(form.get("password")),
    }).unwrap()
    localStorage.setItem("access_token", res.access_token)
    navigate("/dashboard")
  }

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    await register({
      full_name: form.get("full_name"),
      phone: form.get("phone"),
      password: form.get("password"),
    }).unwrap()
    setTab("login")
  }

  return (
    <Card className="w-full max-w-md p-8 shadow-md">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6 w-full justify-center gap-10">
          <TabsTrigger value="login">Log in</TabsTrigger>
          <TabsTrigger value="signup">Sign up</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="flex flex-col gap-4">
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
        </TabsContent>

        <TabsContent value="signup" className="flex flex-col gap-4">
          <form className="flex flex-col gap-4" onSubmit={handleRegister}>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" name="full_name" placeholder="Full name" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="signup_phone">Phone</Label>
              <Input id="signup_phone" name="phone" placeholder="Phone" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="signup_password">Password</Label>
              <Input
                id="signup_password"
                name="password"
                type="password"
                placeholder="Password"
                required
              />
            </div>

            {registerError && (
              <p className="text-sm text-destructive">Could not create account.</p>
            )}

            <Button type="submit" size="lg" className="mt-2" disabled={registering}>
              {registering ? "Creating account..." : "Sign up"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onOpenChange={(open) => {
          setForgotPasswordOpen(open)
          if (!open) setTab("login")
        }}
      />
    </Card>
  )
}
