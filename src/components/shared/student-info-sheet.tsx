import { useState, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { Lock, LockOpen, Mail, Pencil, Send, Trash2, UserPlus, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar } from "@/components/shared/avatar"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Toast } from "@/components/shared/toast"
import {
  useDeleteStudentMutation,
  useGetBranchesQuery,
  useGetStudentQuery,
  useInviteStudentAccountMutation,
  useUpdateStudentMutation,
} from "@/store/services"

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

/**
 * Side panel with a student's details. Opened by clicking a student's name in
 * the students list or in a group's student table.
 */
export function StudentInfoSheet({
  studentId,
  fullName,
  children,
}: {
  studentId: number
  /** Shown until the full record has loaded. */
  fullName: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const { data } = useGetStudentQuery(studentId, { skip: !open })
  const { data: branches } = useGetBranchesQuery(undefined, { skip: !open })
  const [updateStudent] = useUpdateStudentMutation()
  const [deleteStudent] = useDeleteStudentMutation()
  const [invite] = useInviteStudentAccountMutation()

  const [confirm, setConfirm] = useState<"block" | "unblock" | "delete" | null>(null)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [toast, setToast] = useState<string | null>(null)

  const blocked = data?.status === "inactive"
  const dash = (value?: string) => value || "-"
  const branch = branches?.data.find((b) => b.id === data?.branch_id)?.title ?? "-"

  const statusLabel = data
    ? data.status === "active"
      ? "Active"
      : data.status === "inactive"
        ? "Blocked"
        : "Finished"
    : "-"

  const handleConfirm = async () => {
    if (confirm === "delete") {
      await deleteStudent(studentId)
      setOpen(false)
      setToast("Student is success deleted!")
      return
    }
    await updateStudent({
      id: studentId,
      data: { status: confirm === "block" ? "inactive" : "active" },
    })
    setToast(confirm === "block" ? "Student is success blocked!" : "Student is success unblocked!")
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent title="Students info" className="max-w-md">
          <Card className="gap-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xl font-bold">{data?.full_name ?? fullName}</p>
                <p className="text-sm text-muted-foreground">
                  Status:{" "}
                  <span
                    className={
                      data?.status === "active"
                        ? "font-semibold text-success"
                        : "font-semibold text-destructive"
                    }
                  >
                    {statusLabel}
                  </span>
                </p>
              </div>
              <Avatar
                src={data?.photo ?? undefined}
                alt={data?.full_name ?? fullName}
                className="size-20"
              />
            </div>

            <div className="flex items-center gap-3">
              <Button asChild>
                <Link to={`/students/${studentId}/edit`}>
                  <Pencil className="size-4" /> Edit
                </Link>
              </Button>
              <Button
                variant="outline"
                className="ml-auto text-primary"
                onClick={() => setConfirm(blocked ? "unblock" : "block")}
              >
                {blocked ? <LockOpen className="size-4" /> : <Lock className="size-4" />}
                {blocked ? "Unblock" : "Block"}
              </Button>
              <Button
                variant="outline"
                className="text-destructive"
                onClick={() => setConfirm("delete")}
              >
                <Trash2 className="size-4" /> Delete
              </Button>
            </div>
          </Card>

          <Card className="gap-3">
            <Row label="Registrated" value={dash(data?.groups?.[0]?.period)} />
            <Row label="Branch" value={branch} />
            <Row label="Birth date" value={dash(data?.birth_date)} />
            <Row label="Address" value={dash(data?.address)} />

            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold">Phone number:</p>
              <div className="flex items-center justify-between pl-4 text-sm">
                <span className="text-muted-foreground">Student</span>
                <span className="font-semibold">{dash(data?.phone)}</span>
              </div>
              <div className="flex items-center justify-between pl-4 text-sm">
                <span className="text-muted-foreground">Father</span>
                <span className="font-semibold">{dash(data?.father_phone)}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`mailto:${data?.email ?? ""}`}
                className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-xs hover:text-primary"
              >
                <Mail className="size-4 text-primary" />
                {dash(data?.email)}
              </a>
              <a
                href={`https://t.me/${(data?.telegram_username ?? "").replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-xs hover:text-primary"
              >
                <Send className="size-4 text-sky-500" />
                Telegram
              </a>
            </div>
          </Card>

          <Card className="flex-row items-center justify-between">
            <span className="flex items-center gap-2 font-semibold">
              <Wallet className="size-5 text-primary" /> Account
            </span>
            <Button
              variant="ghost"
              className="bg-accent text-primary"
              onClick={() => {
                setInviteEmail(data?.email ?? "")
                setInviteOpen(true)
              }}
            >
              <UserPlus className="size-4" /> {data?.has_account ? "Invited" : "Invite"}
            </Button>
          </Card>
        </SheetContent>
      </Sheet>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-md gap-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Invite</DialogTitle>
          </DialogHeader>
          <Input
            type="email"
            placeholder="Email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <DialogFooter>
            <Button
              disabled={!inviteEmail}
              onClick={async () => {
                await invite({ id: studentId, email: inviteEmail })
                setInviteOpen(false)
                setToast("Invite is success sent!")
              }}
            >
              Invite
            </Button>
            <Button variant="outline" className="text-primary" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirm !== null}
        onOpenChange={(o) => !o && setConfirm(null)}
        title={
          confirm === "delete"
            ? "Do you really want to delete student?"
            : confirm === "unblock"
              ? "Do you really want to unblock student?"
              : "Do you really want to block student?"
        }
        confirmLabel={
          confirm === "delete" ? "Yes, delete" : confirm === "unblock" ? "Yes, unblock" : "Yes, block"
        }
        onConfirm={handleConfirm}
      />

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  )
}
