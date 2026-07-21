import type { ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { LogOut, Lock, Mail, Send, SquarePen, UserRound } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  useGetMyGroupsQuery,
  useGetProfileQuery,
  useGetUpcomingBirthdaysQuery,
  useLogoutMutation,
} from "@/store/services"

export function ProfilePage() {
  const { data: profile } = useGetProfileQuery()
  const { data: birthdays } = useGetUpcomingBirthdaysQuery()
  const { data: groups } = useGetMyGroupsQuery()
  const [logout] = useLogoutMutation()
  const navigate = useNavigate()

  if (!profile) return null

  const handleLogout = async () => {
    await logout()
    localStorage.removeItem("access_token")
    navigate("/login")
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <Card>
          <div className="flex items-start gap-5">
            <div className="relative">
              <div className="flex size-24 items-center justify-center rounded-full bg-muted">
                <UserRound className="size-12 text-muted-foreground" />
              </div>
              <button
                className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground"
                aria-label="Change avatar"
              >
                <SquarePen className="size-3.5" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{profile.full_name}</h2>
              <p className="text-primary font-medium">{profile.role}</p>
              <div className="mt-3 flex gap-3">
                <Button variant="destructive" onClick={handleLogout}>
                  <LogOut /> Log out
                </Button>
                <Button variant="secondary">
                  <SquarePen /> Edit
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-2 flex flex-col divide-y divide-border border-t border-border">
            {[
              ["Registrated:", new Date(profile.registered_at).toLocaleDateString("en-GB")],
              ["Branch:", profile.branch],
              ["Birth date:", new Date(profile.birth_date).toLocaleDateString("en-GB")],
              ["Address:", profile.address ?? "-"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-3 text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between py-3 text-sm">
              <span className="font-semibold">Phone number:</span>
            </div>
            <div className="flex items-center justify-between py-3 pl-4 text-sm">
              <span className="text-muted-foreground">{profile.role}:</span>
              <span className="font-medium">{profile.phone}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary">
              <Mail /> {profile.email}
            </Button>
            <Button variant="secondary">
              <Send /> Telegram
            </Button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <span className="text-lg">🎂</span>
            <CardHeading>Upcoming birthdays</CardHeading>
          </div>
          <div className="flex flex-col divide-y divide-border border-t border-border">
            {birthdays?.data.map((b) => (
              <div key={b.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-muted">
                    <UserRound className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{b.name}</p>
                    <p className={b.date === "Today" || b.date === "Tomorrow" ? "text-sm text-primary" : "text-sm text-muted-foreground"}>
                      {b.date}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="icon">
                  🎉
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <CardHeading>Account</CardHeading>
            <Button variant="secondary" size="sm">
              <Lock className="size-3.5" /> Reset password
            </Button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <CardHeading>Groups</CardHeading>
            <Button variant="link">See all →</Button>
          </div>
          <div className="flex flex-col gap-4">
            {groups?.data.map((group) => (
              <div key={group.id} className="rounded-xl border border-border">
                <div className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-semibold text-primary">{group.title}</p>
                    <p className="text-xs text-muted-foreground">{group.period}</p>
                  </div>
                  <Button size="sm" variant="secondary">
                    Journal
                  </Button>
                </div>
                <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-xs">
                  <span className="text-primary font-medium">{group.days}</span>
                  <span className="text-muted-foreground">{group.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function CardHeading({ children }: { children: ReactNode }) {
  return <h3 className="text-lg font-bold">{children}</h3>
}
