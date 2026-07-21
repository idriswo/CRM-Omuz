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
  type LucideIcon,
} from "lucide-react"

export interface NavLeaf {
  label: string
  to: string
}

export interface NavItem {
  label: string
  icon: LucideIcon
  to?: string
  children?: NavLeaf[]
}

export const navItems: NavItem[] = [
  { label: "Dashboard", icon: Home, to: "/dashboard" },
  {
    label: "Students",
    icon: Users,
    children: [{ label: "All students", to: "/students" }],
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
    children: [
      { label: "Users", to: "/administration/users" },
      { label: "Permission", to: "/administration/permissions" },
      { label: "Logs", to: "/administration/logs" },
    ],
  },
  {
    label: "Accounting",
    icon: Landmark,
    children: [{ label: "Overview", to: "/accounting" }],
  },
  { label: "Branches", icon: Building2, to: "/branches" },
  { label: "Jobs", icon: Briefcase, to: "/jobs" },
  { label: "SMS mailings", icon: Mail, to: "/sms-mailings" },
]
