import { api } from "@/store/api"
import { toList } from "./types"

/**
 * These four endpoints answer with bare arrays / raw Prisma rows rather than the
 * `{ data }` envelope the rest of the API uses, so each one is reshaped here.
 * Without that the screens read `.data`/`.history` off an array and crash.
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

/** `/students/me/groups` → bare `Group[]` with the `course` relation included. */
interface RawMyGroup {
  id: number
  name: string
  start_date?: string
  end_date?: string
  course?: { name?: string } | null
}

/** `/students/me/groupmates` → one row per group, each holding the other students. */
interface RawGroupmateRow {
  group_id: number
  group_name: string
  students?: { id: number; first_name?: string; last_name?: string; photo?: string | null }[]
}

/** `/students/me/scores` → raw `JournalEntry[]` with `week.group` included. */
interface RawScoreEntry {
  day_date: string
  attendance: boolean
  score: number | null
  comment?: string | null
  week?: { group?: { name?: string } | null } | null
}

export const studentSelfApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMyStudentProfile: build.query<MyProfile, void>({
      query: () => ({ url: "/students/me" }),
      providesTags: ["Profile"],
    }),
    getMyStudentGroups: build.query<{ data: MyGroupSelf[] }, void>({
      query: () => ({ url: "/students/me/groups" }),
      transformResponse: (response: RawMyGroup[] | { data?: RawMyGroup[] }) => ({
        data: toList(response).data.map((group) => ({
          id: group.id,
          name: group.name,
          course: group.course?.name ?? "",
          start_date: group.start_date,
          end_date: group.end_date,
        })),
      }),
    }),
    getMyGroupmates: build.query<{ data: Groupmate[] }, void>({
      query: () => ({ url: "/students/me/groupmates" }),
      transformResponse: (response: RawGroupmateRow[] | { data?: RawGroupmateRow[] }) => ({
        data: toList(response).data.flatMap((row) =>
          (row.students ?? []).map((student) => ({
            id: student.id,
            full_name: [student.first_name, student.last_name].filter(Boolean).join(" "),
            group: row.group_name,
            avatar: student.photo ?? null,
          }))
        ),
      }),
    }),
    getMyScores: build.query<{ data: ScoreEntry[] }, void>({
      query: () => ({ url: "/students/me/scores" }),
      transformResponse: (response: RawScoreEntry[] | { data?: RawScoreEntry[] }) => ({
        data: toList(response).data.map((entry) => ({
          date: entry.day_date,
          group: entry.week?.group?.name ?? "",
          attendance: entry.attendance,
          score: entry.score,
          comment: entry.comment ?? "",
        })),
      }),
    }),
    getMyCoins: build.query<MyCoins, void>({
      query: () => ({ url: "/students/me/coins" }),
      // The payload calls the list `transactions`; the page reads `history`.
      transformResponse: (response: {
        balance?: number
        transactions?: { id: number; amount: number; type: string; reason?: string | null; created_at: string }[]
        history?: CoinHistoryEntry[]
      }) => ({
        balance: response?.balance ?? 0,
        history:
          response?.history ??
          (response?.transactions ?? []).map((t) => ({
            id: t.id,
            amount: t.amount,
            type: t.type,
            reason: t.reason ?? "",
            date: t.created_at,
          })),
      }),
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
