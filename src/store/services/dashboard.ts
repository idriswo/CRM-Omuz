import { api } from "@/store/api"
import { toList } from "./types"

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
  students_count: number
  present: number
  absent: number
  income: number
}

export interface LeadsChartPoint {
  month: string
  count: number
}

export interface AttendanceChartPoint {
  day: string
  present: number
  absent: number
}

export interface IncomeThisMonth {
  /** `total` in the payload — summed `Payment.paid` for the requested month. */
  amount: number
  by_day: Record<string, number>
}

export interface EnrollChartPoint {
  month: string
  count: number
}

export interface EmployedGraduatesStats {
  total_graduates: number
  employed: number
  unemployed: number
}

export interface LeftCoursesPoint {
  course: string
  count: number
}

export interface AppNotification {
  id: number
  from: string
  message: string
  date: string
  read: boolean
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

/** `{ "3": 12 }` (month number → count) is how the backend returns every
 * per-month chart; expand it to the 12 points recharts needs. */
function monthMapToPoints(map: Record<string, number> | undefined) {
  return MONTH_NAMES.map((month, i) => ({ month, count: Number(map?.[String(i + 1)] ?? 0) }))
}

/** A raw `JournalEntry` row with the student relation included. */
interface RawJournalEntry {
  id: number
  attendance: boolean
  comment: string | null
  student?: { first_name?: string; last_name?: string; phone?: string } | null
}

interface RawGroupSummary {
  group_id: number
  group_name: string
  students_count: number
  present: number
  absent: number
  income: number
}

interface RawLeftCourses {
  course_name: string
  left_count: number
}

export const dashboardApi = api.injectEndpoints({
  endpoints: (build) => ({
    getDashboardStats: build.query<DashboardStats, void>({
      query: () => ({ url: "/dashboard/stats" }),
    }),
    /** `GET /dashboard/attendance-log` → bare `JournalEntry[]` with `student`
     * included. Only the absences are interesting under the Present/Absent tiles. */
    getAttendanceLog: build.query<{ data: AttendanceLogItem[] }, { date?: string } | void>({
      query: (params) => ({ url: "/dashboard/attendance-log", params: params ?? {} }),
      transformResponse: (response: RawJournalEntry[] | { data?: RawJournalEntry[] }) => ({
        data: toList(response)
          .data.filter((entry) => !entry.attendance)
          .map((entry) => ({
            id: entry.id,
            full_name: [entry.student?.first_name, entry.student?.last_name]
              .filter(Boolean)
              .join(" "),
            phone: entry.student?.phone ?? "",
            group: "",
            reason: entry.comment ?? "",
          })),
      }),
    }),
    /** Bare array keyed `group_id`/`group_name`, not `id`/`name`. */
    getGroupsSummary: build.query<{ data: GroupSummary[] }, void>({
      query: () => ({ url: "/dashboard/groups-summary" }),
      transformResponse: (response: RawGroupSummary[] | { data?: RawGroupSummary[] }) => ({
        data: toList(response).data.map((row) => ({
          id: row.group_id,
          name: row.group_name,
          students_count: row.students_count ?? 0,
          present: row.present ?? 0,
          absent: row.absent ?? 0,
          income: row.income ?? 0,
        })),
      }),
    }),
    getLeadsChart: build.query<{ data: LeadsChartPoint[] }, { year: number }>({
      query: (params) => ({ url: "/dashboard/leads-chart", params }),
      transformResponse: (response: Record<string, number>) => ({
        data: monthMapToPoints(response),
      }),
    }),
    /** `{ "2026-02-14": { present, absent } }` → one point per day of the month. */
    getAttendanceChart: build.query<{ data: AttendanceChartPoint[] }, { month: string }>({
      query: (params) => ({ url: "/dashboard/attendance-chart", params }),
      transformResponse: (response: Record<string, { present?: number; absent?: number }>) => ({
        data: Object.entries(response ?? {})
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([day, counts]) => ({
            day: day.slice(8),
            present: counts?.present ?? 0,
            absent: counts?.absent ?? 0,
          })),
      }),
    }),
    getIncomeThisMonth: build.query<IncomeThisMonth, { month: string }>({
      query: (params) => ({ url: "/dashboard/income", params }),
      transformResponse: (response: { total?: number; by_day?: Record<string, number> }) => ({
        amount: response?.total ?? 0,
        by_day: response?.by_day ?? {},
      }),
    }),
    getEnrollChart: build.query<{ data: EnrollChartPoint[] }, { year?: number } | void>({
      query: (params) => ({ url: "/dashboard/enroll-chart", params: params ?? {} }),
      transformResponse: (response: Record<string, number>) => ({
        data: monthMapToPoints(response),
      }),
    }),
    /** Counters only — the graduate rows come from `GET /students/graduates`. */
    getEmployedGraduates: build.query<EmployedGraduatesStats, void>({
      query: () => ({ url: "/dashboard/employed-graduates" }),
    }),
    /** Bare array of `{ course_name, left_count }`, grouped per group. */
    getDashboardLeftCourses: build.query<{ data: LeftCoursesPoint[] }, void>({
      query: () => ({ url: "/dashboard/left-courses" }),
      transformResponse: (response: RawLeftCourses[] | { data?: RawLeftCourses[] }) => ({
        data: toList(response).data.map((row) => ({
          course: row.course_name,
          count: row.left_count ?? 0,
        })),
      }),
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
  useGetDashboardLeftCoursesQuery,
  useGetNotificationsQuery,
} = dashboardApi
