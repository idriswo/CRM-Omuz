import { api } from "@/store/api"

/**
 * Response shapes here are best-effort — the backend's swagger doc has no
 * request/response schemas (JSDoc-only descriptions), so these are inferred
 * from the endpoint names and the RBAC brief. Adjust once the real payload
 * is confirmed against a live backend.
 */
export interface MyProfile {
  id: number
  full_name: string
  phone: string
  branch?: string
  birth_date?: string
  address?: string | null
  avatar?: string | null
}

export interface MyGroupSelf {
  id: number
  name: string
  course?: string
  mentor?: string
  start_date?: string
  end_date?: string
}

export interface Groupmate {
  id: number
  full_name: string
  group: string
  avatar?: string | null
}

export interface ScoreEntry {
  date: string
  group: string
  attendance: boolean
  score: number | null
  comment?: string
}

export interface CoinHistoryEntry {
  id: number
  amount: number
  type: string
  reason?: string
  date: string
}

export interface MyCoins {
  balance: number
  history: CoinHistoryEntry[]
}

export const studentSelfApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMyStudentProfile: build.query<MyProfile, void>({
      query: () => ({ url: "/students/me" }),
      providesTags: ["Profile"],
    }),
    getMyStudentGroups: build.query<{ data: MyGroupSelf[] }, void>({
      query: () => ({ url: "/students/me/groups" }),
    }),
    getMyGroupmates: build.query<{ data: Groupmate[] }, void>({
      query: () => ({ url: "/students/me/groupmates" }),
    }),
    getMyScores: build.query<{ data: ScoreEntry[] }, void>({
      query: () => ({ url: "/students/me/scores" }),
    }),
    getMyCoins: build.query<MyCoins, void>({
      query: () => ({ url: "/students/me/coins" }),
    }),
  }),
})

export const {
  useGetMyStudentProfileQuery,
  useGetMyStudentGroupsQuery,
  useGetMyGroupmatesQuery,
  useGetMyScoresQuery,
  useGetMyCoinsQuery,
} = studentSelfApi
