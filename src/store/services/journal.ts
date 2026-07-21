import { api } from "@/store/api"

export interface JournalDay {
  date: string
  attendance: boolean
  score: number | null
  comment: string
}

export interface JournalStudentRow {
  student_id: number
  full_name: string
  days: JournalDay[]
  bonus: number
  exam: number
  sum: number
}

export interface JournalWeek {
  week_number: number
  dates: string[]
  students: JournalStudentRow[]
}

export interface JournalChartPoint {
  week: string
  [studentName: string]: string | number
}

export interface Journal {
  group_id: number
  group_name: string
  weeks: JournalWeek[]
  chart: JournalChartPoint[]
  students: { id: number; name: string }[]
  /** Optional Google Sheets embed shown on the second tab. */
  sheet_url?: string | null
}

export interface JournalCellBody {
  day_date: string
  attendance?: boolean
  score?: number | null
  comment?: string
  bonus?: number
  exam?: number
}

export const journalApi = api.injectEndpoints({
  endpoints: (build) => ({
    getJournal: build.query<Journal, number>({
      query: (groupId) => ({ url: `/groups/${groupId}/journal` }),
      providesTags: ["Journal"],
    }),
    addJournalWeek: build.mutation<JournalWeek, { groupId: number; dates: string[] }>({
      query: ({ groupId, dates }) => ({
        url: `/groups/${groupId}/journal/week`,
        method: "post",
        data: { dates },
      }),
      invalidatesTags: ["Journal"],
    }),
    updateJournalCell: build.mutation<
      { success: boolean },
      { groupId: number; weekId: number; studentId: number; data: JournalCellBody }
    >({
      query: ({ groupId, weekId, studentId, data }) => ({
        url: `/groups/${groupId}/journal/${weekId}/students/${studentId}`,
        method: "put",
        data,
      }),
      // No invalidation: the grid keeps its own edited state, a refetch would discard it.
    }),
  }),
})

export const {
  useGetJournalQuery,
  useAddJournalWeekMutation,
  useUpdateJournalCellMutation,
} = journalApi
