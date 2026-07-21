import { api } from "@/store/api"

export interface Profile {
  id: number
  full_name: string
  role: string
  registered_at: string
  branch: string
  birth_date: string
  address: string | null
  phone: string
  email: string
  telegram: string
  avatar: string | null
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
  }),
})

export const { useGetProfileQuery, useGetUpcomingBirthdaysQuery, useGetMyGroupsQuery } =
  profileApi
