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
  /** Row id of the week. The write endpoints accept either this or `week_number`
   * (the backend's `resolveWeek` tries the number first), so it is optional. */
  week_id?: number
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

interface RawJournalEntry {
  id: number
  day_date: string
  attendance: boolean
  score: number | null
  bonus: number | null
  exam: number | null
}

interface RawJournalStudent {
  student_id: number
  first_name?: string
  last_name?: string
  full_name?: string
  /** Current backend shape — already one row per day. */
  days?: JournalDay[]
  /** Older backend shape — raw `JournalEntry` rows to fold into `days`. */
  entries?: RawJournalEntry[]
  bonus?: number
  exam?: number
  sum?: number
}

interface RawJournalWeek {
  week_id?: number
  week_number: number
  dates?: string[]
  students?: RawJournalStudent[]
}

interface RawJournal {
  group_id: number
  group_name: string
  weeks?: RawJournalWeek[]
  chart?: JournalChartPoint[]
  students?: { id: number; name: string }[]
  sheet_url?: string | null
}

/**
 * `GET /groups/:id/journal` already returns the grid the page renders
 * (`weeks[].students[].days[]` plus `chart`, `students` and `sheet_url`), so this
 * mostly passes the payload through. It still folds the older `entries[]` shape
 * into `days[]` and fills in `chart`/`students` when they are absent, and it
 * defaults every list — an empty journal used to arrive without `entries` and
 * crashed the whole page with "Cannot read properties of undefined (reading 'map')".
 */
function normalizeJournal(raw: RawJournal): Journal {
  const studentNames = new Map<number, string>()

  const weeks: JournalWeek[] = (raw?.weeks ?? []).map((week) => ({
    week_id: week.week_id,
    week_number: week.week_number,
    dates: week.dates ?? [],
    students: (week.students ?? []).map((student) => {
      const full_name =
        student.full_name || [student.first_name, student.last_name].filter(Boolean).join(" ")
      studentNames.set(student.student_id, full_name)

      const entries = student.entries ?? []
      const days: JournalDay[] =
        student.days ??
        entries.map((entry) => ({
          date: entry.day_date,
          attendance: entry.attendance,
          score: entry.score,
          comment: "",
        }))

      return {
        student_id: student.student_id,
        full_name,
        days,
        bonus: student.bonus ?? entries.reduce((sum, e) => sum + (e.bonus ?? 0), 0),
        exam: student.exam ?? entries.reduce((sum, e) => sum + (e.exam ?? 0), 0),
        sum: student.sum ?? days.reduce((sum, d) => sum + (d.score ?? 0), 0),
      }
    }),
  }))

  const chart: JournalChartPoint[] =
    raw?.chart ??
    weeks.map((week) => {
      const point: JournalChartPoint = { week: `Week ${week.week_number}` }
      for (const student of week.students) {
        const scored = student.days.filter((d) => d.score !== null)
        point[student.full_name] = scored.length
          ? Math.round(scored.reduce((s, d) => s + (d.score ?? 0), 0) / scored.length)
          : 0
      }
      return point
    })

  return {
    group_id: raw?.group_id,
    group_name: raw?.group_name,
    weeks,
    chart,
    students: raw?.students ?? Array.from(studentNames, ([id, name]) => ({ id, name })),
    sheet_url: raw?.sheet_url ?? null,
  }
}

export const journalApi = api.injectEndpoints({
  endpoints: (build) => ({
    getJournal: build.query<Journal, number>({
      query: (groupId) => ({ url: `/groups/${groupId}/journal` }),
      transformResponse: (response: RawJournal) => normalizeJournal(response),
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

    /** The link is stored per group; the backend mirrors the journal into that sheet. */
    setJournalSheet: build.mutation<
      { success: boolean; sheet_url: string | null },
      { groupId: number; sheet_url: string }
    >({
      query: ({ groupId, sheet_url }) => ({
        url: `/groups/${groupId}/journal/sheet`,
        method: "put",
        data: { sheet_url },
      }),
      invalidatesTags: ["Journal"],
    }),
    syncJournalSheet: build.mutation<{ success: boolean }, number>({
      query: (groupId) => ({ url: `/groups/${groupId}/journal/sync`, method: "post" }),
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
  useSetJournalSheetMutation,
  useSyncJournalSheetMutation,
} = journalApi
