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

// --- Accounting ---

export type PaymentStatus = "Active" | "Prepayment"

export interface PaymentRow {
  id: number
  full_name: string
  phone: string
  amount: number
  discount: number
  paid: number
  date: string
  group: string
  branch: string
  status: PaymentStatus
}

const paymentGroupNames = ["C# 5 June", "React", "HTML June", "Olympiad 4", "C# 2 August"]
export const branchNames = ["Sadbarg", "Profsous"]

export const payments: PaymentRow[] = Array.from({ length: 34 }, (_, i) => {
  const discount = i % 5 === 0 ? 400 : i % 7 === 0 ? 200 : 0
  return {
    id: i + 1,
    full_name: "Dilovar Karimov",
    phone: "93 258 4147",
    amount: 1000 - discount,
    discount,
    paid: 1000,
    date: "30.01.2024",
    group: paymentGroupNames[i % paymentGroupNames.length],
    branch: branchNames[i % branchNames.length],
    status: i % 3 === 1 ? "Prepayment" : "Active",
  }
})

export interface BudgetRow {
  id: number
  category_name: string
  from_date: string
  to_date: string
  amount_allocated: number
  amount_spent: number
  status: "Active" | "Inactive"
}

const budgetCategories = ["Marketing", "Office expenses", "Tax", "Employees"]

export const budgetRows: BudgetRow[] = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  category_name: budgetCategories[i % budgetCategories.length],
  from_date: "01.04.2023",
  to_date: "01.05.2023",
  amount_allocated: 1000,
  amount_spent: 1000,
  status: i % 9 === 8 ? "Inactive" : "Active",
}))

export const budgetChart = (from: number, to: number) =>
  months
    .map((month, i) => ({
      month,
      amount_allocated: Math.round(15000 + 8000 * Math.sin(i / 1.6) + i * 300),
      amount_spent: Math.round(12000 + 6000 * Math.cos(i / 1.8) + i * 150),
    }))
    .slice(0, Math.max(1, to - from + 1 || 12))

export interface SalaryRow {
  id: number
  full_name: string
  total: number
  prepaid: number
  remaining: number
  paid: number
  month: string
  status: "Active" | "Inactive"
}

const salaryNames = ["Abdulsamad Ahmad", "Shamsuddinov Najibullo"]

export const salaryRows: SalaryRow[] = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  full_name: salaryNames[i % salaryNames.length],
  total: 4500,
  prepaid: 1000,
  remaining: 3500,
  paid: 3500,
  month: months[i % 12],
  status: i % 6 === 2 ? "Inactive" : "Active",
}))

export type AvansStatus = "pending" | "approved" | "denied"

export interface AvansRow {
  id: number
  full_name: string
  month: string
  amount: number
  description: string
  status: AvansStatus
}

export const avansRows: AvansRow[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  full_name: "Tojiev Olimjon",
  month: "April",
  amount: 1000,
  description: "I need money, give me my money, please)",
  status: i === 0 ? "pending" : i % 3 === 0 ? "denied" : "approved",
}))

export interface DebtorRow {
  id: number
  full_name: string
  from_date: string
  to_date: string
  total_debt_amount: number
  payment_per_month: number
  total_paid_amount: number
  notes: string
  status: "Inprogress" | "Paid"
}

export const debtorRows: DebtorRow[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  full_name: "Dilovar Karimov",
  from_date: "01.04.2023",
  to_date: "01.05.2023",
  total_debt_amount: 1000,
  payment_per_month: 1000,
  total_paid_amount: 1000,
  notes: "---------",
  status: i % 3 === 0 ? "Paid" : "Inprogress",
}))

export interface ExpenseSubRow {
  id: number
  name: string
  total_payment: number
  recipient: string
  branch: string
  status: "Active" | "Inactive"
}

export interface ExpenseRow extends ExpenseSubRow {
  children?: ExpenseSubRow[]
}

export const expenseRows: ExpenseRow[] = [
  {
    id: 1,
    name: "Tax",
    total_payment: 1000,
    recipient: "Student",
    branch: "Sadbarg",
    status: "Active",
    children: [
      { id: 11, name: "Income tax", total_payment: 300, recipient: "Student", branch: "Sadbarg", status: "Active" },
      { id: 12, name: "VAT (value added tax)", total_payment: 200, recipient: "Student", branch: "Sadbarg", status: "Active" },
      { id: 13, name: "Property tax", total_payment: 200, recipient: "Student", branch: "Sadbarg", status: "Active" },
      { id: 14, name: "Social taxes (on wages, etc.)", total_payment: 300, recipient: "Student", branch: "Sadbarg", status: "Active" },
    ],
  },
  { id: 2, name: "Office expenses", total_payment: 1000, recipient: "Student", branch: "Sadbarg", status: "Active" },
  { id: 3, name: "Marketing", total_payment: 1000, recipient: "Student", branch: "Profsous", status: "Inactive" },
  { id: 4, name: "Employees", total_payment: 1000, recipient: "Student", branch: "Profsous", status: "Active" },
]

export interface NetRow {
  id: number
  full_name: string
  category: string
  date: string
  amount: number
}

export const netRows: NetRow[] = [
  { id: 1, full_name: "Ahmad Abdulsamad", category: "Student", date: "21.06.2023", amount: 1000 },
  { id: 2, full_name: "Ahmad Abdulsamad", category: "Student", date: "21.06.2023", amount: 1000 },
  { id: 3, full_name: "Ahmad Abdulsamad", category: "Student", date: "21.06.2023", amount: 1000 },
  { id: 4, full_name: "Ahmad Abdulsamad", category: "Student", date: "21.06.2023", amount: 1000 },
  { id: 5, full_name: "Ahmad Abdulsamad", category: "Student", date: "21.06.2023", amount: 1000 },
  { id: 6, full_name: "Ahmad Abdulsamad", category: "Mentor", date: "21.06.2023", amount: -500 },
  { id: 7, full_name: "Admin", category: "Income tax", date: "21.06.2023", amount: -500 },
  { id: 8, full_name: "Admin", category: "Income tax", date: "21.06.2023", amount: -500 },
  { id: 9, full_name: "Admin", category: "Income tax", date: "21.06.2023", amount: -500 },
  { id: 10, full_name: "Admin", category: "Income tax", date: "21.06.2023", amount: -500 },
  { id: 11, full_name: "Admin", category: "Income tax", date: "21.06.2023", amount: -500 },
]

export interface AccountantRow {
  id: number
  started_at: string
  finished_at: string
  total_income: number
  total_expense: number
  paid: number
  not_paid: number
  net: number
  branch: string
  status: "Inprogress" | "Archive"
}

export const accountantRows: AccountantRow[] = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  started_at: "01.04.2023",
  finished_at: "01.05.2023",
  total_income: 1000,
  total_expense: 500,
  paid: 500,
  not_paid: 500,
  net: 2500,
  branch: branchNames[i % 2],
  status: i % 3 === 2 ? "Archive" : "Inprogress",
}))

export const accountantChart = (year: number) =>
  months.map((month, i) => ({
    month,
    year,
    income: Math.round(15000 + 10000 * Math.sin(i / 1.7) + 8000),
    expense: Math.round(20000 + 8000 * Math.cos(i / 1.9) + 4000),
  }))

export const accountingStats = { total_payment: 20500, paid_amount: 11000, not_paid: 5000, net: 5000 }

export const accountingChart = (year: number) =>
  months.slice(0, 7).map((month, i) => ({
    month,
    year,
    Income: Math.round(8000 + 9000 * Math.sin(i / 1.4) + 7000),
    Expense: Math.round(9000 + 8000 * Math.cos(i / 1.6) + 6000),
  }))

export const studentsPaymentDonut = { total: 60, paid_percent: 20, paid_count: 22, not_paid_percent: 80, not_paid_count: 48 }

export interface StudentsPaymentMember {
  id: number
  full_name: string
  phone: string
  sum: number
  status: "Paid" | "Not paid"
}

export interface StudentsPaymentGroup {
  id: number
  group: string
  students: number
  not_paid: number
  total: number
  not_paid_amount: number
  members: StudentsPaymentMember[]
}

const paymentMembers = (): StudentsPaymentMember[] =>
  Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    full_name: "Tojiev Olimjon",
    phone: "93 800 22 74",
    sum: i % 2 === 0 ? 0 : 1000,
    status: i % 2 === 0 ? "Not paid" : "Paid",
  }))

export const studentsPaymentGroups: StudentsPaymentGroup[] = [
  { id: 1, group: "C# 2 August", students: 12, not_paid: 4, total: 18000, not_paid_amount: 6000, members: paymentMembers() },
  { id: 2, group: "React", students: 12, not_paid: 4, total: 18000, not_paid_amount: 6000, members: paymentMembers() },
]

// --- SMS mailings ---

export interface SmsTemplate {
  id: number
  title: string
  description: string
}

export const smsTemplates: SmsTemplate[] = [
  {
    id: 1,
    title: "Open day",
    description:
      "Hello friends!\nWe would like to inform you that today is the last day to pay tuition fees for January. Please pay on time.",
  },
  {
    id: 2,
    title: "Changed the payment",
    description:
      "Hello friends!\nWe would like to inform you that today is the last day to pay tuition fees for January. Please pay on time.",
  },
  {
    id: 3,
    title: "Qarzdoron",
    description:
      "Hello dear students!\nWe would like to inform you that today is the last day to pay tuition fees for January. Please pay on time.",
  },
  {
    id: 4,
    title: "Warning",
    description: "Hello friends!\nPlease be aware of the upcoming exam schedule changes.",
  },
  {
    id: 5,
    title: "Congratulation!",
    description: "Congratulations on completing the course! We wish you success in your career.",
  },
]

export interface SmsHistoryItem {
  id: number
  title: string
  sent_at: string
  description: string
  groups: { name: string; period: string; members: string }[]
}

export const smsHistory: SmsHistoryItem[] = [
  { id: 1, title: "Open day", sent_at: "21.05.2024", description: smsTemplates[0].description, groups: [] },
  {
    id: 2,
    title: "Qarzdoron",
    sent_at: "21.05.2024",
    description: "Hello dear students!\nWe would like to inform you that today is the last day to pay tuition fees for January. Please pay on time.",
    groups: [
      { name: "C# 5", period: "Apr 9, 2023 - Aug 10, 2023", members: "Tojiev Olimjon, Shodmon Inoyatzoda, Alijon Zabiri, Faridun Dodarov" },
      { name: "React - 4", period: "Apr 9, 2023 - Aug 10, 2023", members: "Tojiev Olimjon, Shodmon Inoyatzoda, Alijon Zabiri, Faridun Dodarov" },
    ],
  },
  { id: 3, title: "Changed the payment", sent_at: "21.05.2024", description: smsTemplates[1].description, groups: [] },
  { id: 4, title: "Warning", sent_at: "21.05.2024", description: smsTemplates[3].description, groups: [] },
  { id: 5, title: "Congratulation!", sent_at: "21.05.2024", description: smsTemplates[4].description, groups: [] },
]

export interface SmsGroupStudent {
  id: number
  full_name: string
  phone: string
}

export interface SmsGroup {
  id: number
  title: string
  period: string
  studentsTotal: number
  present: number
  students: SmsGroupStudent[]
}

const groupStudentNames = [
  "Ahmad Abdulsamad",
  "Tojiev Olimjon",
  "Najibullo Shamsuddinov",
  "Shodmon Inoyatzoda",
  "Alijon Zabiri",
  "Faridun Dodarov",
  "Nazarov Qurbonali",
  "Muhammadjon Mirzoev",
]

const makeSmsGroupStudents = (): SmsGroupStudent[] =>
  groupStudentNames.map((name, i) => ({ id: i + 1, full_name: name, phone: "93 800 22 74" }))

export const smsGroups: SmsGroup[] = [
  { id: 1, title: "C# 5", period: "Apr 9, 2023 - Aug 10, 2023", studentsTotal: 15, present: 7, students: makeSmsGroupStudents() },
  { id: 2, title: "React - 4", period: "Apr 9, 2023 - Aug 10, 2023", studentsTotal: 7, present: 4, students: makeSmsGroupStudents() },
  { id: 3, title: "Olympiad 2", period: "Apr 9, 2023 - Aug 10, 2023", studentsTotal: 15, present: 14, students: makeSmsGroupStudents() },
  { id: 4, title: "C# 1", period: "Apr 9, 2023 - Aug 10, 2023", studentsTotal: 15, present: 7, students: makeSmsGroupStudents() },
]

export interface SmsPerson {
  id: number
  full_name: string
  phone: string
  age: number
  course: string
  fatherPhone?: string
  motherPhone?: string
  level?: string
  tag?: string
  tagVariant?: "success" | "secondary" | "outline"
  bank?: string
}

export const smsStudents: SmsPerson[] = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  full_name: "Tojiev Olimjon",
  phone: "932584147",
  age: 23,
  course: "JavaScript August",
  fatherPhone: "935400101",
  motherPhone: "888881414",
}))

export const smsMentors: SmsPerson[] = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  full_name: "Alijon Zabirov",
  phone: "932584147",
  age: 23,
  course: "",
  level: "Middle 2",
}))

export const smsLeads: SmsPerson[] = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  full_name: "Tojiev Olimjon",
  phone: "932584147",
  age: 23,
  course: "JavaScript August",
  tag: i % 3 === 1 ? "Client" : "Lead",
  tagVariant: i % 3 === 1 ? "outline" : "secondary",
}))

const graduateTags = ["Enterepreneur", "#Freelancer", "#FurtherEducation", "#OpenToWork", "#Work"]

export const smsGraduates: SmsPerson[] = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  full_name: "Tojiev Olimjon",
  phone: "932584147",
  age: 23,
  course: "",
  tag: graduateTags[i % graduateTags.length],
  bank: "Alif bank",
}))

// --- Dashboard ---

export const dashboardStats = { students_count: 88, users_count: 10, employees_count: 15, present: 60, absent: 24, late: 4 }

export interface AttendanceLogItem {
  id: number
  full_name: string
  phone: string
  group: string
  reason: string
}

export const attendanceLog: AttendanceLogItem[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  full_name: "Tojiev Olimjon",
  phone: "985415287",
  group: i % 2 === 0 ? "HTML June" : "C# June",
  reason: i === 1 ? "" : "Компютераш вайрон шуд, наомад дарс ...",
}))

export interface GroupSummary {
  id: number
  name: string
  absent: number
  late: number
  income: number
}

export const groupsSummary: GroupSummary[] = ["C++ May", "C# 2 August", "React", "Olympiad 4", "HTML June"].map(
  (name, i) => ({ id: i + 1, name, absent: 4, late: 2, income: 8250 })
)

const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export const leadsChart = (year: number) =>
  monthsShort.map((month, i) => ({ month, year, count: Math.round(70 + 50 * Math.sin(i / 1.6) + 30) }))

export const attendanceChartDash = (month: string) =>
  Array.from({ length: 30 }, (_, i) => ({
    day: String(i + 1).padStart(2, "0"),
    month,
    late: Math.round(20 + 15 * Math.sin(i / 3)),
    absent: Math.round(20 + 15 * Math.cos(i / 3.4)),
  }))

export const incomeThisMonth = (month: string) => ({ month, amount: 12580, percent: 90, diff_from_last_month: -1200 })

export const enrollChart = () => monthsShort.map((month, i) => ({ month, count: Math.round(15 + 20 * Math.sin(i / 1.5) + 15) }))

export interface EnrollRow {
  id: number
  full_name: string
  course: string
  phone: string
}

export const enrollList: EnrollRow[] = [
  { id: 1, full_name: "Ahmad Abdulsamad", course: "Javascript", phone: "93 800 22 74" },
  { id: 2, full_name: "Tojiev Olimjon", course: "React", phone: "93 800 22 74" },
  { id: 3, full_name: "Najibullo Shamsuddinov", course: "Olympiad", phone: "93 800 22 74" },
  { id: 4, full_name: "Alijon Zabiri", course: "HTML & CSS", phone: "93 800 22 74" },
  { id: 5, full_name: "Shodmon Inoyatzoda", course: "C# (.net)", phone: "93 800 22 74" },
  { id: 6, full_name: "Nazarov Qurbonali", course: "UX/UI design", phone: "93 800 22 74" },
  { id: 7, full_name: "Alij Rasulov", course: "HTML & CSS", phone: "93 800 22 74" },
  { id: 8, full_name: "Muhammadjon Mirzoev", course: "Graf design", phone: "93 800 22 74" },
]

export interface EmployedGraduate {
  id: number
  full_name: string
  age: string
  course: string
  date_of_issue: string
  work_place: string
}

export const employedGraduates: EmployedGraduate[] = [
  { id: 1, full_name: "Huseinov Hasan", age: "18 year", course: "JavaScript", date_of_issue: "Jan 11, 2023", work_place: "Softclub" },
  { id: 2, full_name: "Huseinov Hasan", age: "18 year", course: "React", date_of_issue: "Jan 11, 2023", work_place: "Alif bank" },
  { id: 3, full_name: "Huseinov Hasan", age: "18 year", course: "HTML & CSS", date_of_issue: "Jan 11, 2023", work_place: "Humo" },
  { id: 4, full_name: "Huseinov Hasan", age: "18 year", course: "UX/UI design", date_of_issue: "Jan 11, 2023", work_place: "Megafon" },
  { id: 5, full_name: "Huseinov Hasan", age: "18 year", course: "Graf design", date_of_issue: "Jan 11, 2023", work_place: "Humo" },
]

export const leftCourses = () =>
  monthsShort.map((month, i) => ({ month, count: Math.round(10 + 16 * Math.abs(Math.sin(i * 1.3))) }))

export interface AppNotification {
  id: number
  from: string
  message: string
  date: string
  read: boolean
}

export const appNotifications: AppNotification[] = [
  {
    id: 1,
    from: "Admin",
    message:
      "Вы пропустили занятие React June (center) 25 июня 2023 г. Если вы пропустите 3 занятия, вы будете отчисленны из академии.",
    date: "25 June, 12:00",
    read: true,
  },
  {
    id: 2,
    from: "Teacher",
    message:
      "Ура, поздравляем! Вы получили сертификат за курс «HTML & CSS». Его можно найти в разделе Профиль >> Мои сертификаты, можно скачать или поделиться им.",
    date: "25 June, 12:00",
    read: false,
  },
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
