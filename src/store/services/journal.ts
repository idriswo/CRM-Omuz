import { api } from "@/store/api"

export interface JournalDay {
  date: string
  attendance: boolean
  score: number | null
  comment: string
  /** Minutes the student was late. */
  late?: number
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
  late?: number
  bonus?: number
  exam?: number
}

export const journalApi = api.injectEndpoints({
  endpoints: (build) => ({
    getJournal: build.query<Journal, number>({
      query: (groupId) => ({ url: `/groups/${groupId}/journal` }),
      providesTags: ["Journal"],
    }),
    addJournalWeek: build.mutation<
      JournalWeek,
      { groupId: number; dates: string[]; week_number?: number }
    >({
      query: ({ groupId, dates, week_number }) => ({
        url: `/groups/${groupId}/journal/week`,
        method: "post",
        data: { dates, week_number },
      }),
      invalidatesTags: ["Journal"],
    }),
    addJournalDate: build.mutation<
      { success: boolean },
      { groupId: number; weekId: number; date: string }
    >({
      query: ({ groupId, weekId, date }) => ({
        url: `/groups/${groupId}/journal/${weekId}/date`,
        method: "post",
        data: { date },
      }),
      invalidatesTags: ["Journal"],
    }),
    updateJournalDate: build.mutation<
      { success: boolean },
      { groupId: number; weekId: number; index: number; date: string }
    >({
      query: ({ groupId, weekId, index, date }) => ({
        url: `/groups/${groupId}/journal/${weekId}/date/${index}`,
        method: "put",
        data: { date },
      }),
      invalidatesTags: ["Journal"],
    }),
    deleteJournalDate: build.mutation<
      { success: boolean },
      { groupId: number; weekId: number; index: number }
    >({
      query: ({ groupId, weekId, index }) => ({
        url: `/groups/${groupId}/journal/${weekId}/date/${index}`,
        method: "delete",
      }),
      invalidatesTags: ["Journal"],
    }),
    deleteJournalWeek: build.mutation<{ success: boolean }, { groupId: number; weekId: number }>({
      query: ({ groupId, weekId }) => ({
        url: `/groups/${groupId}/journal/${weekId}`,
        method: "delete",
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
  useAddJournalDateMutation,
  useUpdateJournalDateMutation,
  useDeleteJournalDateMutation,
  useDeleteJournalWeekMutation,
  useUpdateJournalCellMutation,
} = journalApi
