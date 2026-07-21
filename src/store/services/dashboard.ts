import { api } from "@/store/api"

export interface DashboardStats {
  students_count: number
  users_count: number
  employees_count: number
  present: number
  absent: number
  late: number
}

export interface AttendanceLogItem {
  id: number
  full_name: string
  phone: string
  group: string
  reason: string
}

export interface GroupSummary {
  id: number
  name: string
  absent: number
  late: number
  income: number
}

export interface LeadsChartPoint {
  month: string
  count: number
}

export interface AttendanceChartPoint {
  day: string
  late: number
  absent: number
}

export interface IncomeThisMonth {
  month: string
  amount: number
  percent: number
  diff_from_last_month: number
}

export interface EnrollRow {
  id: number
  full_name: string
  course: string
  phone: string
}

export interface EmployedGraduate {
  id: number
  full_name: string
  age: string
  course: string
  date_of_issue: string
  work_place: string
}

export interface LeftCoursesPoint {
  month: string
  count: number
}

export interface AppNotification {
  id: number
  from: string
  message: string
  date: string
  read: boolean
}

export const dashboardApi = api.injectEndpoints({
  endpoints: (build) => ({
    getDashboardStats: build.query<DashboardStats, void>({
      query: () => ({ url: "/dashboard/stats" }),
    }),
    getAttendanceLog: build.query<{ data: AttendanceLogItem[] }, { date?: string } | void>({
      query: (params) => ({ url: "/dashboard/attendance-log", params: params ?? {} }),
    }),
    getGroupsSummary: build.query<{ data: GroupSummary[] }, void>({
      query: () => ({ url: "/dashboard/groups-summary" }),
    }),
    getLeadsChart: build.query<{ data: LeadsChartPoint[] }, { year: number }>({
      query: (params) => ({ url: "/dashboard/leads-chart", params }),
    }),
    getAttendanceChart: build.query<{ data: AttendanceChartPoint[] }, { month: string }>({
      query: (params) => ({ url: "/dashboard/attendance-chart", params }),
    }),
    getIncomeThisMonth: build.query<IncomeThisMonth, { month: string }>({
      query: (params) => ({ url: "/dashboard/income", params }),
    }),
    getEnrollChart: build.query<{ chart: { month: string; count: number }[]; data: EnrollRow[] }, void>({
      query: () => ({ url: "/dashboard/enroll-chart" }),
    }),
    getEmployedGraduates: build.query<{ data: EmployedGraduate[]; meta: { total: number } }, { limit?: number } | void>({
      query: (params) => ({ url: "/dashboard/employed-graduates", params: params ?? {} }),
    }),
    getLeftCourses: build.query<{ data: LeftCoursesPoint[] }, void>({
      query: () => ({ url: "/dashboard/left-courses" }),
    }),
    getNotifications: build.query<{ data: AppNotification[] }, void>({
      query: () => ({ url: "/notifications" }),
    }),
  }),
})

export const {
  useGetDashboardStatsQuery,
  useGetAttendanceLogQuery,
  useGetGroupsSummaryQuery,
  useGetLeadsChartQuery,
  useGetAttendanceChartQuery,
  useGetIncomeThisMonthQuery,
  useGetEnrollChartQuery,
  useGetEmployedGraduatesQuery,
  useGetLeftCoursesQuery,
  useGetNotificationsQuery,
} = dashboardApi
