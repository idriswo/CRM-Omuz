import {
  Home,
  Users,
  LayoutGrid,
  UserSquare2,
  BookUser,
  CalendarDays,
  Layers,
  ShieldCheck,
  Landmark,
  Building2,
  Briefcase,
  Mail,
  Coins,
  UsersRound,
  LineChart,
  type LucideIcon,
} from "lucide-react"

import type { Role } from "@/lib/auth"

export interface NavLeaf {
  label: string
  to: string
}

export interface NavItem {
  label: string
  icon: LucideIcon
  to?: string
  children?: NavLeaf[]
  /** Omit to show to every staff role (admin/superadmin/director). */
  roles?: Role[]
}

export const navItems: NavItem[] = [
  { label: "Dashboard", icon: Home, to: "/dashboard" },
  {
    label: "Students",
    icon: Users,
    children: [
      { label: "All students", to: "/students" },
      { label: "Graduates", to: "/students/graduates" },
      { label: "Leaders", to: "/students/leaders" },
      { label: "Student activity", to: "/students/activity" },
      { label: "Left courses", to: "/students/left-courses" },
      { label: "Enroll students", to: "/students/enroll" },
    ],
  },
  { label: "Groups", icon: LayoutGrid, to: "/groups" },
  { label: "Employees", icon: UserSquare2, to: "/employees" },
  { label: "Progressbook", icon: BookUser, to: "/progressbook" },
  { label: "Timetable", icon: CalendarDays, to: "/timetable" },
  {
    label: "Courses",
    icon: Layers,
    children: [
      { label: "All courses", to: "/courses" },
      { label: "Leads", to: "/courses/leads" },
    ],
  },
  {
    label: "Administration",
    icon: ShieldCheck,
    roles: ["superadmin", "director"],
    children: [
      { label: "Users", to: "/administration/users" },
      { label: "Permission", to: "/administration/permissions" },
      { label: "Logs", to: "/administration/logs" },
    ],
  },
  {
    label: "Accounting",
    icon: Landmark,
    to: "/accounting",
    roles: ["director"],
    children: [
      { label: "Payment's", to: "/accounting/payments" },
      { label: "Budget", to: "/accounting/budget" },
      { label: "Salary", to: "/accounting/salary" },
      { label: "Avans", to: "/accounting/avans" },
    ],
  },
  { label: "Branches", icon: Building2, to: "/branches" },
  { label: "Jobs", icon: Briefcase, to: "/jobs" },
  { label: "SMS mailings", icon: Mail, to: "/sms-mailings" },
]

/** Student role gets its own tiny, entirely read-only menu — see the RBAC doc. */
export const studentNavItems: NavItem[] = [
  { label: "My profile", icon: Home, to: "/student/profile" },
  { label: "Classmates", icon: UsersRound, to: "/student/groupmates" },
  { label: "Scores & attendance", icon: LineChart, to: "/student/scores" },
  { label: "My coins", icon: Coins, to: "/student/coins" },
]
