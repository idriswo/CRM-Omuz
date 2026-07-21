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

type Step = "phone" | "otp" | "reset" | "done"

interface ForgotPasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const OTP_LENGTH = 4

function StepIcon({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-accent">
      {children}
    </div>
  )
}

export function ForgotPasswordDialog({ open, onOpenChange }: ForgotPasswordDialogProps) {
  const [step, setStep] = useState<Step>("phone")
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(""))
  const [error, setError] = useState<string | null>(null)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const [sendCode, { isLoading: sending }] = useForgotPasswordMutation()
  const [verifyCode, { isLoading: verifying }] = useVerifyResetCodeMutation()
  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation()

  const reset = () => {
    setStep("phone")
    setPhone("")
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
      await sendCode({ phone }).unwrap()
      setStep("otp")
    } catch {
      setError("Could not send the code. Check the phone number and try again.")
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
    setCode(Array(OTP_LENGTH).fill(""))
    otpRefs.current[0]?.focus()
    await sendCode({ phone })
  }

  const handleVerifyCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    try {
      await verifyCode({ phone, code: code.join("") }).unwrap()
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
      await resetPassword({ phone, code: code.join(""), password }).unwrap()
      setStep("done")
    } catch {
      setError("Could not reset the password. Please try again.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === "phone" && (
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
                Don&apos;t worry! We&apos;ll send to your phone number a code to reset your
                password
              </DialogDescription>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSendCode}>
              <Input
                placeholder="Phone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
              <DialogDescription>Enter the code that you received</DialogDescription>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleVerifyCode}>
              <div className="flex justify-center gap-3">
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
                    className="h-12 w-12 text-center text-lg font-semibold"
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
              <Input name="password" type="password" placeholder="New password" required />
              <Input
                name="confirm_password"
                type="password"
                placeholder="Confirm password"
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
