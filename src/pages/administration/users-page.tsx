import { useState } from "react"
import { Plus, Search, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Toast } from "@/components/shared/toast"
import { apiErrorMessage } from "@/lib/api-error"
import { useDeleteUserMutation, useGetUsersQuery, type AdminUser } from "@/store/services"
import { CreateUserDialog } from "./create-user-dialog"

export function UsersPage() {
  const [search, setSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<AdminUser | null>(null)
  const [toast, setToast] = useState<{ message: string; variant?: "success" | "error" } | null>(null)
  const { data, isLoading } = useGetUsersQuery({ search, limit: 20 })
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation()

  const handleDelete = async () => {
    if (!pendingDelete) return
    try {
      await deleteUser(pendingDelete.id).unwrap()
      setToast({ message: `${pendingDelete.full_name} deleted.` })
    } catch (err) {
      setToast({ message: apiErrorMessage(err), variant: "error" })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus /> Add user
        </Button>
      </div>

      <div className="w-72">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name"
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {data?.data?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.full_name}</TableCell>
                <TableCell>{user.type}</TableCell>
                <TableCell>{user.role_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="text-right">
                  <button
                    className="rounded-md p-1.5 text-destructive hover:bg-accent"
                    aria-label={`Delete ${user.full_name}`}
                    onClick={() => setPendingDelete(user)}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <CreateUserDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(result) => {
          if (result.email_sent) {
            setToast({ message: `Invite sent to ${result.email}.` })
          } else {
            setToast({
              message: `Could not email ${result.email} — ask them to use "Forgot password?" on the login page.`,
              variant: "error",
            })
          }
        }}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title={`Delete ${pendingDelete?.full_name ?? "this user"}?`}
        description="This cannot be undone — they will lose access immediately."
        loading={deleting}
        onConfirm={handleDelete}
      />

      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
