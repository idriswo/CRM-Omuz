import { api } from "@/store/api"

export interface Profile {
  id: number
  full_name: string
  role: "Admin" | "Mentor" | "Student"
  status?: string
  registered_at: string
  branch: string
  birth_date: string
  address: string | null
  phone: string
  father_phone?: string
  email: string
  telegram: string
  avatar: string | null
  mentor_level?: string
  hourly_rate?: string
  notification_channel?: "sms" | "telegram"
  language?: "ru" | "en" | "tj"
}

export interface Birthday {
  id: number
  name: string
  date: string
}

export interface MyGroup {
  id: number
  title: string
  period: string
  days: string
  time: string
  duration: string
}

export interface RoadmapWeek {
  week: number
  score: number
}

export interface RoadmapGroup {
  id: number
  title: string
  period: string
  initials: string
  color: string
  weeks: RoadmapWeek[]
  average: number
}

export interface PerformanceDay {
  label: string
  score: number
  present: string
  late: string
  comment: string
}

export interface Performance {
  present_hours: number
  absent_hours: number
  late_minutes: number
  group: string
  week: number
  days: PerformanceDay[]
  expense: { month: string; value: number; present: string; late: string; comment: string }[]
  roadmap: RoadmapGroup[]
}

export const profileApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<Profile, void>({
      query: () => ({ url: "/me" }),
      providesTags: ["Profile"],
    }),
    getUpcomingBirthdays: build.query<{ data: Birthday[] }, void>({
      query: () => ({ url: "/me/birthdays" }),
    }),
    getMyGroups: build.query<{ data: MyGroup[] }, void>({
      query: () => ({ url: "/me/groups" }),
    }),
    getPerformance: build.query<Performance, { week?: number; year?: number } | void>({
      query: (params) => ({ url: "/me/performance", params: params ?? {} }),
      providesTags: ["Profile"],
    }),
  }),
})

export const {
  useGetProfileQuery,
  useGetUpcomingBirthdaysQuery,
  useGetMyGroupsQuery,
  useGetPerformanceQuery,
} = profileApi
