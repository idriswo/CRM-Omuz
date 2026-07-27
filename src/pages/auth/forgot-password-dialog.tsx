import { useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react"
import { CheckCircle2, KeyRound, Mail, ShieldCheck } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyResetCodeMutation,
} from "@/store/services"
import { apiErrorMessage } from "@/lib/api-error"

type Step = "email" | "otp" | "reset" | "done"

interface ForgotPasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const OTP_LENGTH = 6

function StepIcon({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-accent">
      {children}
    </div>
  )
}

export function ForgotPasswordDialog({ open, onOpenChange }: ForgotPasswordDialogProps) {
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(""))
  const [resetToken, setResetToken] = useState("")
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const [sendCode, { isLoading: sending }] = useForgotPasswordMutation()
  const [verifyCode, { isLoading: verifying }] = useVerifyResetCodeMutation()
  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation()

  const reset = () => {
    setStep("email")
    setEmail("")
    setCode(Array(OTP_LENGTH).fill(""))
    setResetToken("")
    setAttemptsLeft(null)
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
      // Always 200 by design — the backend never reveals whether the address is registered.
      await sendCode({ email }).unwrap()
      setStep("otp")
    } catch (err) {
      setError(apiErrorMessage(err, { fallback: "Could not send the code. Please try again." }))
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

  const handleRequestNewCode = async () => {
    setError(null)
    setAttemptsLeft(null)
    setCode(Array(OTP_LENGTH).fill(""))
    otpRefs.current[0]?.focus()
    await sendCode({ email })
  }

  const handleVerifyCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await verifyCode({ email, code: code.join("") }).unwrap()
      setResetToken(res.reset_token)
      setStep("reset")
    } catch (err) {
      const data = (err as { data?: { attempts_left?: number } })?.data
      if (typeof data?.attempts_left === "number") {
        setAttemptsLeft(data.attempts_left)
        setError(`Invalid code. ${data.attempts_left} attempts left.`)
      } else {
        setAttemptsLeft(null)
        setError(apiErrorMessage(err, { fallback: "Invalid code. Please try again." }))
        // 5 wrong attempts burns the code — send the user back to request a new one.
        setStep("email")
      }
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
      await resetPassword({ reset_token: resetToken, new_password: password }).unwrap()
      setStep("done")
    } catch (err) {
      setError(apiErrorMessage(err, { fallback: "Could not reset the password. Please try again." }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === "email" && (
          <>
            <DialogHeader>
              <DialogTitle>Forgot password?</DialogTitle>
            </DialogHeader>
            <StepIcon>
              <Mail className="size-9 text-primary" />
            </StepIcon>
            <div className="text-center">
              <p className="font-semibold">Verification code</p>
              <DialogDescription>
                Don&apos;t worry! We&apos;ll send a code to your email to reset your password
              </DialogDescription>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSendCode}>
              <Input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={sending}>
                  {sending ? "Sending..." : "Send code"}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}

        {step === "otp" && (
          <>
            <DialogHeader>
              <DialogTitle>Forgot password?</DialogTitle>
            </DialogHeader>
            <StepIcon>
              <ShieldCheck className="size-9 text-primary" />
            </StepIcon>
            <div className="text-center">
              <p className="font-semibold">Verification code</p>
              <DialogDescription>Enter the code sent to {email}</DialogDescription>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleVerifyCode}>
              <div className="flex justify-center gap-2">
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
                    className="h-12 w-10 text-center text-lg font-semibold"
                    autoFocus={i === 0}
                  />
                ))}
              </div>
              <Button
                type="button"
                variant="link"
                className="mx-auto"
                onClick={handleRequestNewCode}
              >
                Request a new code
              </Button>
              {error && <p className="text-sm text-destructive">{error}</p>}
              {attemptsLeft !== null && !error && (
                <p className="text-center text-sm text-muted-foreground">
                  {attemptsLeft} attempts left.
                </p>
              )}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={verifying || code.some((d) => !d)}>
                  {verifying ? "Verifying..." : "Confirm"}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}

        {step === "reset" && (
          <>
            <DialogHeader>
              <DialogTitle>Reset password</DialogTitle>
            </DialogHeader>
            <StepIcon>
              <KeyRound className="size-9 text-primary" />
            </StepIcon>
            <p className="text-center font-semibold">Create a new password</p>
            <form className="flex flex-col gap-4" onSubmit={handleResetPassword}>
              <Input name="password" type="password" placeholder="New password" minLength={8} required />
              <Input
                name="confirm_password"
                type="password"
                placeholder="Confirm password"
                minLength={8}
                required
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={resetting}>
                  {resetting ? "Saving..." : "Confirm"}
                </Button>
              </DialogFooter>
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
