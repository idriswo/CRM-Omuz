import { useRef, useState, type FormEvent, type KeyboardEvent } from "react"
import { CheckCircle2 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyResetCodeMutation,
} from "@/store/services"

type Step = "email" | "otp" | "reset" | "done"

interface ForgotPasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const OTP_LENGTH = 6

export function ForgotPasswordDialog({ open, onOpenChange }: ForgotPasswordDialogProps) {
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(""))
  const [error, setError] = useState<string | null>(null)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const [sendCode, { isLoading: sending }] = useForgotPasswordMutation()
  const [verifyCode, { isLoading: verifying }] = useVerifyResetCodeMutation()
  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation()

  const reset = () => {
    setStep("email")
    setEmail("")
    setCode(Array(OTP_LENGTH).fill(""))
    setError(null)
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) reset()
    onOpenChange(next)
  }

  const handleSendCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    try {
      await sendCode({ email }).unwrap()
      setStep("otp")
    } catch {
      setError("Could not send the code. Check the email and try again.")
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    const next = [...code]
    next[index] = value
    setCode(next)
    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    try {
      await verifyCode({ email, code: code.join("") }).unwrap()
      setStep("reset")
    } catch {
      setError("Invalid code. Please try again.")
    }
  }

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const form = new FormData(e.currentTarget)
    const password = String(form.get("password"))
    const confirmPassword = String(form.get("confirm_password"))

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    try {
      await resetPassword({ email, code: code.join(""), password }).unwrap()
      setStep("done")
    } catch {
      setError("Could not reset the password. Please try again.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === "email" && (
          <>
            <DialogHeader>
              <DialogTitle>Forgot password?</DialogTitle>
              <DialogDescription>
                Enter your email and we&apos;ll send you a 6-digit code.
              </DialogDescription>
            </DialogHeader>
            <form className="flex flex-col gap-4" onSubmit={handleSendCode}>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="you@gmail.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" size="lg" disabled={sending}>
                {sending ? "Sending..." : "Send code"}
              </Button>
            </form>
          </>
        )}

        {step === "otp" && (
          <>
            <DialogHeader>
              <DialogTitle>Enter the code</DialogTitle>
              <DialogDescription>
                We sent a 6-digit code to <span className="font-medium">{email}</span>.
              </DialogDescription>
            </DialogHeader>
            <form className="flex flex-col gap-4" onSubmit={handleVerifyCode}>
              <div className="flex justify-between gap-2">
                {code.map((digit, i) => (
                  <Input
                    key={i}
                    ref={(el) => {
                      otpRefs.current[i] = el
                    }}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    inputMode="numeric"
                    maxLength={1}
                    className="h-12 w-11 text-center text-lg font-semibold"
                    autoFocus={i === 0}
                  />
                ))}
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" size="lg" disabled={verifying || code.some((d) => !d)}>
                {verifying ? "Verifying..." : "Verify code"}
              </Button>
            </form>
          </>
        )}

        {step === "reset" && (
          <>
            <DialogHeader>
              <DialogTitle>Set a new password</DialogTitle>
              <DialogDescription>Choose a new password for your account.</DialogDescription>
            </DialogHeader>
            <form className="flex flex-col gap-4" onSubmit={handleResetPassword}>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-password">New password</Label>
                <Input id="new-password" name="password" type="password" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input id="confirm-password" name="confirm_password" type="password" required />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" size="lg" disabled={resetting}>
                {resetting ? "Saving..." : "Change password"}
              </Button>
            </form>
          </>
        )}

        {step === "done" && (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <CheckCircle2 className="size-14 text-success" />
            <div>
              <h3 className="text-lg font-bold">Password changed</h3>
              <p className="text-sm text-muted-foreground">
                You can now log in with your new password.
              </p>
            </div>
            <Button size="lg" className="w-full" onClick={() => handleOpenChange(false)}>
              Back to log in
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
