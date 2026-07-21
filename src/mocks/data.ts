export type Role = "Admin" | "Mentor" | "Student" | "Accountant"

export interface AdminUser {
  id: number
  full_name: string
  phone: string
  email: string
  type: Role
  role_id: number
  role_name: string
  branch_id: number
}

export interface Permission {
  id: number
  name: string
  group: string
  enabled: boolean
}

export interface RoleRow {
  id: number
  name: string
  users_count: number
}

export interface LogEntry {
  id: number
  user: string
  action: string
  entity: string
  date: string
}

export interface Branch {
  id: number
  title: string
  city: string
  district: string
  address: string
  groups_count: number
  students_count: number
  status: "Active" | "Inactive"
}

const names = [
  "Ahmad Abdulsamad",
  "Alijon Zabiri",
  "Nazarov Qurbonali",
  "Najibullo Shamsuddinov",
  "Fariddun Dodarov",
  "Hojiabdurahim S",
  "Sitora Karimova",
  "Manuchehr Rahimov",
]

export const users: AdminUser[] = Array.from({ length: 42 }, (_, i) => ({
  id: i + 1,
  full_name: names[i % names.length],
  phone: "93 258 4147",
  email: "user@omuz.tj",
  type: i % 5 === 0 ? "Mentor" : i % 7 === 0 ? "Accountant" : "Student",
  role_id: (i % 3) + 1,
  role_name: i % 5 === 0 ? "Mentor" : i % 7 === 0 ? "Accountant" : "Student",
  branch_id: (i % 2) + 1,
}))

const permissionGroups = ["Mentors", "Students", "Groups", "Accounting", "Branches"]

export const permissions: Permission[] = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  name: `Permission.${permissionGroups[i % permissionGroups.length]}.Views`,
  group: permissionGroups[i % permissionGroups.length],
  enabled: i % 3 !== 0,
}))

export const roles: RoleRow[] = [
  { id: 1, name: "Admin", users_count: 3 },
  { id: 2, name: "Mentor", users_count: 18 },
  { id: 3, name: "Student", users_count: 640 },
  { id: 4, name: "Accountant", users_count: 2 },
]

export const logs: LogEntry[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  user: "Hojiabdurahim S",
  action: "Recent activity log",
  entity: "User",
  date:
    i < 3
      ? new Date().toISOString()
      : new Date(Date.now() - 86400000).toISOString(),
}))

export const branches: Branch[] = [
  {
    id: 1,
    title: "Sadbarg",
    city: "Dushanbe",
    district: "Shohmansur",
    address: "Ayni street 46",
    groups_count: 6,
    students_count: 55,
    status: "Active",
  },
  {
    id: 2,
    title: "Profsous",
    city: "Dushanbe",
    district: "Shohmansur",
    address: "Ayni street 46",
    groups_count: 6,
    students_count: 55,
    status: "Active",
  },
]

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export const branchChart = (year: number) =>
  months.map((month, i) => ({
    month,
    year,
    Sadbarg: Math.round(40 + 80 * Math.sin(i / 1.8) + 60),
    Profsous: Math.round(60 + 70 * Math.cos(i / 2.1) + 50),
  }))

export const currentUser = {
  id: 1,
  full_name: "Hojiabdurahim S",
  role: "Admin",
  registered_at: "2022-09-15",
  branch: "Sadbarg",
  birth_date: "1995-08-23",
  address: null as string | null,
  phone: "93 435 4943",
  email: "hojiabdurahims@mail.com",
  telegram: "@hojiabdurahims",
  avatar: null as string | null,
}

export const upcomingBirthdays = [
  { id: 1, name: "Nazarov Qurbonali", date: "Today" },
  { id: 2, name: "Najibullo Shamsuddinov", date: "Tomorrow" },
  { id: 3, name: "Ahmad Abdulsamad", date: "April 9, 2023" },
  { id: 4, name: "Alijon Zabiri", date: "April 9, 2023" },
  { id: 5, name: "Fariddun Dodarov", date: "April 12, 2023" },
]

export const myGroups = [
  {
    id: 1,
    title: "UX/UI design",
    period: "Aug 11, 2023 - Oct 10, 2023",
    days: "Mn, Tu, Wd, Th, Fr, Sa",
    time: "16:00 - 18:00",
    duration: "2 month",
  },
  {
    id: 2,
    title: "HTML & CSS #2 April",
    period: "Aug 11, 2023 - Oct 10, 2023",
    days: "Mn, Tu, Wd, Th, Fr, Sa",
    time: "16:00 - 18:00",
    duration: "1 month",
  },
  {
    id: 3,
    title: "JavaScript August",
    period: "Aug 11, 2023 - Oct 10, 2023",
    days: "Mn, Tu, Wd, Th, Fr, Sa",
    time: "16:00 - 18:00",
    duration: "1 month",
  },
]
