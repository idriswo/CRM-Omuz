import { useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChevronRight,
  LogOut,
  Lock,
  Mail,
  Megaphone,
  Plus,
  Send,
  SquarePen,
  UserPlus,
  UserRound,
} from "lucide-react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RoadmapCard } from "@/components/shared/roadmap-card"
import {
  useGetMyGroupsQuery,
  useGetPerformanceQuery,
  useGetProfileQuery,
  useGetUpcomingBirthdaysQuery,
  useLogoutMutation,
  type Profile,
} from "@/store/services"

function CardHeading({ children }: { children: ReactNode }) {
  return <h3 className="text-lg font-bold">{children}</h3>
}

function ProfileHeaderCard({ profile }: { profile: Profile }) {
  const [logout] = useLogoutMutation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    localStorage.removeItem("access_token")
    navigate("/login")
  }

  return (
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
          {profile.role === "Admin" ? (
            <p className="text-primary font-medium">{profile.role}</p>
          ) : (
            <p className="font-medium text-muted-foreground">
              Status: <span className="text-success">{profile.status ?? "Active"}</span>
            </p>
          )}
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
        {profile.role === "Student" && profile.father_phone && (
          <div className="flex items-center justify-between py-3 pl-4 text-sm">
            <span className="text-muted-foreground">Father:</span>
            <span className="font-medium">{profile.father_phone}</span>
          </div>
        )}
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
  )
}

function MentorLevelCard({ profile }: { profile: Profile }) {
  return (
    <Card className="flex-row items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">Mentor level</p>
        <p className="text-lg font-bold">{profile.mentor_level}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm">
          hour: <span className="font-semibold text-success">{profile.hourly_rate}</span>
        </span>
        <Button variant="secondary" size="sm">
          <SquarePen className="size-3.5" /> Change
        </Button>
      </div>
    </Card>
  )
}

function AccountCard() {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <CardHeading>Account</CardHeading>
        <Button variant="secondary" size="sm">
          <Lock className="size-3.5" /> Reset password
        </Button>
      </div>
    </Card>
  )
}

function NotificationCard({ profile }: { profile: Profile }) {
  const [channel, setChannel] = useState(profile.notification_channel ?? "telegram")
  const [language, setLanguage] = useState(profile.language ?? "ru")

  return (
    <Card>
      <CardHeading>Notification</CardHeading>
      <div className="flex gap-3">
        {(["sms", "telegram"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setChannel(option)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              channel === option
                ? "border-primary bg-accent text-primary"
                : "border-input text-muted-foreground"
            }`}
          >
            <span
              className={`size-4 rounded-full border-2 ${
                channel === option ? "border-primary bg-primary" : "border-input"
              }`}
            />
            {option === "sms" ? "SMS (phone)" : "Telegram"}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Language</p>
        <div className="flex gap-4">
          {(
            [
              ["ru", "Русский"],
              ["en", "English"],
              ["tj", "Точики"],
            ] as const
          ).map(([code, label]) => (
            <button
              key={code}
              type="button"
              onClick={() => setLanguage(code)}
              className="flex items-center gap-2 text-sm"
            >
              <span
                className={`size-4 rounded-full border-2 ${
                  language === code ? "border-primary bg-primary" : "border-input"
                }`}
              />
              {label}
            </button>
          ))}
        </div>
      </div>
    </Card>
  )
}

function AvansCard() {
  const navigate = useNavigate()
  return (
    <Card className="flex-row items-center justify-between">
      <CardHeading>Avans</CardHeading>
      <Button variant="secondary" size="icon" onClick={() => navigate("/accounting/avans")}>
        <Plus className="size-4" />
      </Button>
    </Card>
  )
}

function InviteFriendCard() {
  return (
    <Card className="flex-row items-center justify-between gap-4">
      <div>
        <p className="font-semibold">Invite a friend and get a discount</p>
        <p className="text-sm text-muted-foreground">
          You and the invitee receive a discount for the first month of training
        </p>
        <Button className="mt-3" size="sm">
          <UserPlus className="size-4" /> Invite
        </Button>
      </div>
      <Megaphone className="size-16 shrink-0 text-primary/40" />
    </Card>
  )
}

function BirthdaysCard() {
  const { data: birthdays } = useGetUpcomingBirthdaysQuery()
  return (
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
                <p
                  className={
                    b.date === "Today" || b.date === "Tomorrow"
                      ? "text-sm text-primary"
                      : "text-sm text-muted-foreground"
                  }
                >
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
  )
}

function GroupsCard() {
  const { data: groups } = useGetMyGroupsQuery()
  return (
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
  )
}

function PerformanceSummaryCard() {
  const navigate = useNavigate()
  const { data } = useGetPerformanceQuery()

  return (
    <Card className="gap-4">
      <div className="flex items-center justify-between">
        <button
          className="flex items-center gap-1 font-bold text-primary"
          onClick={() => navigate("/profile/performance")}
        >
          Performance <ChevronRight className="size-4" />
        </button>
        {data && <p className="text-sm text-muted-foreground">{data.group}</p>}
      </div>

      {data && (
        <>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-success/10 px-3 py-2 text-center">
              <p className="text-xs text-muted-foreground">Present</p>
              <p className="font-bold text-success">{data.present_hours}h</p>
            </div>
            <div className="rounded-lg bg-destructive/10 px-3 py-2 text-center">
              <p className="text-xs text-muted-foreground">Absent</p>
              <p className="font-bold text-destructive">{data.absent_hours}h</p>
            </div>
            <div className="rounded-lg bg-orange-500/10 px-3 py-2 text-center">
              <p className="text-xs text-muted-foreground">Late</p>
              <p className="font-bold text-orange-500">{data.late_minutes}m</p>
            </div>
          </div>
          <div className="h-[140px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.days} margin={{ top: 8, right: 8, bottom: 0, left: -30 }}>
                <defs>
                  <linearGradient id="perfMini" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--color-border)" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                  fill="url(#perfMini)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </Card>
  )
}

function GroupsRoadmapCard() {
  const { data } = useGetPerformanceQuery()
  return (
    <Card>
      <CardHeading>Groups roadmap</CardHeading>
      <div className="flex flex-col gap-4">
        {data?.roadmap.map((group) => (
          <RoadmapCard key={group.id} group={group} />
        ))}
      </div>
    </Card>
  )
}

export function ProfilePage() {
  const { data: profile } = useGetProfileQuery()

  if (!profile) return null

  if (profile.role === "Student") {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <ProfileHeaderCard profile={profile} />
          <AccountCard />
          <NotificationCard profile={profile} />
          <InviteFriendCard />
          <BirthdaysCard />
        </div>
        <div className="flex flex-col gap-6">
          <PerformanceSummaryCard />
          <GroupsRoadmapCard />
        </div>
      </div>
    )
  }

  if (profile.role === "Mentor") {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <ProfileHeaderCard profile={profile} />
          <MentorLevelCard profile={profile} />
          <BirthdaysCard />
        </div>
        <div className="flex flex-col gap-6">
          <AccountCard />
          <NotificationCard profile={profile} />
          <AvansCard />
          <GroupsCard />
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <ProfileHeaderCard profile={profile} />
        <BirthdaysCard />
      </div>
      <div className="flex flex-col gap-6">
        <AccountCard />
        <GroupsCard />
      </div>
    </div>
  )
}
