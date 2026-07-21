// Static mock data — design only. Backend wiring comes later (see endpoints.md).

export type EmployeeRole = "Admin" | "Manager" | "Developer" | "Mentor"
export type EmployeeStatus = "Active" | "Inactive"

export interface Employee {
  id: number
  fullName: string
  phone: string
  age: number
  roles: EmployeeRole[]
  status: EmployeeStatus
  photo?: string
}

export const employees: Employee[] = [
  { id: 1, fullName: "Sulaymonov Nurullo", phone: "93 258 4147", age: 23, roles: ["Admin"], status: "Active" },
  { id: 2, fullName: "Begimadov Masafi", phone: "93 258 4147", age: 23, roles: ["Admin"], status: "Active" },
  { id: 3, fullName: "Kabirov Zoirjon", phone: "93 258 4147", age: 23, roles: ["Admin", "Manager"], status: "Inactive" },
  { id: 4, fullName: "Ashurzoda Kurbonali", phone: "93 258 4147", age: 23, roles: ["Manager"], status: "Active" },
  { id: 5, fullName: "Soliev Salohiddin", phone: "93 258 4147", age: 23, roles: ["Manager"], status: "Active" },
  { id: 6, fullName: "Rahimova Parinoz", phone: "93 258 4147", age: 23, roles: ["Manager"], status: "Inactive" },
  { id: 7, fullName: "Abdulsamad Ahmad", phone: "93 258 4147", age: 23, roles: ["Developer", "Manager"], status: "Active" },
  { id: 8, fullName: "Tojiev Olimjon", phone: "93 258 4147", age: 23, roles: ["Developer", "Manager"], status: "Inactive" },
  { id: 9, fullName: "Shamsuddinov Najibullo", phone: "93 258 4147", age: 23, roles: ["Developer", "Mentor"], status: "Active" },
  { id: 10, fullName: "Inoyatzoda Shodmon", phone: "93 258 4147", age: 23, roles: ["Developer"], status: "Active" },
  { id: 11, fullName: "Zabiri Alijon", phone: "93 258 4147", age: 23, roles: ["Developer", "Mentor"], status: "Active" },
]

export const positions = ["Admin", "Manager", "Developer", "Mentor"] as const
export const statuses = ["Active", "Inactive"] as const

// ---- Mentor levels matrix ----

export type MentorLevel =
  | "Intern"
  | "Junior 1"
  | "Junior 2"
  | "Junior 3"
  | "Middle 1"
  | "Middle 2"
  | "Senior 1"
  | "Senior 2"
  | "Senior 3"

export const months = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUNE",
  "JULY", "AUG", "SEP", "OCT", "NOV", "DEC",
] as const

export interface MentorLevelRow {
  id: number
  fullName: string
  levels: (MentorLevel | null)[] // 12 entries, one per month, null = no data
}

const L = (v: string): MentorLevel | null => (v === "" ? null : (v as MentorLevel))

export const mentorLevelRows: MentorLevelRow[] = [
  { id: 1, fullName: "Nurullo Sulaymonov", levels: ["Intern","Intern","Junior 1","Junior 2","Junior 2","Junior 3","Middle 1","Senior 1","Senior 2","Senior 3","Senior 3","Senior 3"].map(L) },
  { id: 2, fullName: "Muhammadjon Mirzoev", levels: ["Intern","Intern","","Junior 2","","Junior 3","Middle 1","Senior 1","Senior 2","Senior 3","Senior 3","Senior 3"].map(L) },
  { id: 3, fullName: "Alijon Zabirov", levels: ["Intern","Intern","Junior 1","Junior 2","Junior 2","","Middle 1","","","","Senior 3","Senior 3"].map(L) },
  { id: 4, fullName: "Mehriddin Saidov", levels: ["Intern","Intern","Junior 1","","Junior 2","","Middle 1","Senior 1","","","Senior 3","Senior 3"].map(L) },
  { id: 5, fullName: "Najibullo Shamsuddinov", levels: ["","Intern","Junior 1","Junior 2","Junior 2","Junior 3","Middle 1","Senior 1","Senior 2","Senior 3","Senior 3","Senior 3"].map(L) },
  { id: 6, fullName: "Tojiev Olimjon", levels: ["Intern","","Junior 1","Junior 2","Junior 2","","Middle 1","Senior 1","","","Senior 3","Senior 3"].map(L) },
  { id: 7, fullName: "Alijon Rasulov", levels: ["Intern","Intern","Junior 1","","Junior 2","Junior 3","Middle 1","Senior 1","Senior 2","Senior 3","Senior 3","Senior 3"].map(L) },
  { id: 8, fullName: "Hasan Huseinov", levels: ["","","Junior 1","Junior 2","Junior 2","","Middle 1","","Senior 2","Senior 3","Senior 3","Senior 3"].map(L) },
  { id: 9, fullName: "Olimjon Sharifov", levels: ["Intern","","Junior 1","Junior 2","","Junior 3","Middle 1","Senior 1","Senior 2","","Senior 3","Senior 3"].map(L) },
  { id: 10, fullName: "Kurbonali Nazarov", levels: ["Intern","","Junior 1","","Junior 2","Junior 3","Middle 1","Senior 1","","Senior 3","","Senior 3"].map(L) },
]
