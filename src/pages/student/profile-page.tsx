import { useNavigate } from "react-router-dom"
import { LogOut, UserRound } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useGetMyStudentGroupsQuery, useGetMyStudentProfileQuery, useLogoutMutation } from "@/store/services"
import { clearSession } from "@/lib/auth"

export function StudentProfilePage() {
  const { data: profile } = useGetMyStudentProfileQuery()
  const { data: groups } = useGetMyStudentGroupsQuery()
  const [logout] = useLogoutMutation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    clearSession()
    navigate("/login")
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">My profile</h1>

      <Card>
        <div className="flex items-center gap-5">
          <div className="flex size-20 items-center justify-center rounded-full bg-muted">
            <UserRound className="size-10 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{profile?.full_name ?? "..."}</h2>
            <p className="text-sm text-muted-foreground">{profile?.phone}</p>
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut /> Log out
          </Button>
        </div>

        <div className="mt-2 flex flex-col divide-y divide-border border-t border-border">
          <div className="flex items-center justify-between py-3 text-sm">
            <span className="text-muted-foreground">Branch:</span>
            <span className="font-medium">{profile?.branch ?? "-"}</span>
          </div>
          <div className="flex items-center justify-between py-3 text-sm">
            <span className="text-muted-foreground">Birth date:</span>
            <span className="font-medium">{profile?.birth_date ?? "-"}</span>
          </div>
          <div className="flex items-center justify-between py-3 text-sm">
            <span className="text-muted-foreground">Address:</span>
            <span className="font-medium">{profile?.address ?? "-"}</span>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold">My groups</h3>
        <div className="flex flex-col gap-3">
          {groups?.data?.map((group) => (
            <div key={group.id} className="rounded-xl border border-border p-4">
              <p className="font-semibold text-primary">{group.name}</p>
              <p className="text-sm text-muted-foreground">
                {group.course} {group.mentor && `· ${group.mentor}`}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
