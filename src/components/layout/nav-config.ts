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
  /** Omit to show to every role that can already see the parent item. */
  roles?: Role[]
}

export interface NavItem {
  label: string
  icon: LucideIcon
  to?: string
  children?: NavLeaf[]
  /** Omit to show to every staff role (mentor/superadmin/director). */
  roles?: Role[]
}

/** Menu visibility follows the RBAC access matrix — see the backend RBAC doc.
 * Mentors only get Groups, Journal, Students (view), Timetable (view) and their profile. */
export const navItems: NavItem[] = [
  { label: "Dashboard", icon: Home, to: "/dashboard", roles: ["superadmin", "director"] },
  {
    label: "Students",
    icon: Users,
    children: [
      { label: "All students", to: "/students" },
      { label: "Graduates", to: "/students/graduates", roles: ["superadmin", "director"] },
      { label: "Leaders", to: "/students/leaders" },
      { label: "Student activity", to: "/students/activity" },
      { label: "Left courses", to: "/students/left-courses", roles: ["superadmin", "director"] },
      { label: "Enroll students", to: "/students/enroll", roles: ["superadmin", "director"] },
    ],
  },
  { label: "Groups", icon: LayoutGrid, to: "/groups" },
  { label: "Employees", icon: UserSquare2, to: "/employees", roles: ["superadmin", "director"] },
  { label: "Progressbook", icon: BookUser, to: "/progressbook", roles: ["superadmin", "director"] },
  { label: "Timetable", icon: CalendarDays, to: "/timetable" },
  {
    label: "Courses",
    icon: Layers,
    roles: ["superadmin", "director"],
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
  { label: "Branches", icon: Building2, to: "/branches", roles: ["superadmin", "director"] },
  { label: "Jobs", icon: Briefcase, to: "/jobs", roles: ["superadmin", "director"] },
  { label: "Email mailings", icon: Mail, to: "/sms-mailings", roles: ["superadmin", "director"] },
]

/** Student role gets its own tiny, entirely read-only menu — see the RBAC doc. */
export const studentNavItems: NavItem[] = [
  { label: "My profile", icon: Home, to: "/student/profile" },
  { label: "Classmates", icon: UsersRound, to: "/student/groupmates" },
  { label: "Scores & attendance", icon: LineChart, to: "/student/scores" },
  { label: "My coins", icon: Coins, to: "/student/coins" },
]
