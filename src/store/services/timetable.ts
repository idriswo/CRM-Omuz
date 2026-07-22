import { api } from "@/store/api"

/** Exactly what `GET /timetable` returns (backend prisma model `TimetableEntry`).
 * Recurring entries are expanded server-side: one object per occurrence inside
 * the requested range, each carrying its own `date`. */
export interface TimetableEntry {
  id: number
  course_name: string
  group_id: number | null
  type: string
  /** ISO datetime — only the clock part is meaningful. */
  start_time: string
  end_time: string
  class_room: string
  mentor_id: number
  /** ISO datetime of this occurrence. */
  date: string
  repeat_days: number[]
}

export interface TimetableBody {
  course_name: string
  group_id?: number | null
  type: string
  start_time: string
  end_time: string
  class_room: string
  mentor_id: number
  date: string
  repeat_days?: number[]
}

export interface TimetableParams {
  view?: "day" | "week" | "month"
  /** ISO date; the backend derives the range from it. */
  date?: string
  group_id?: number
  mentor_id?: number
}

export const timetableApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTimetable: build.query<TimetableEntry[], TimetableParams | void>({
      query: (params) => ({ url: "/timetable", params: params ?? {} }),
      providesTags: ["Timetable"],
    }),
    createTimetableEntry: build.mutation<TimetableEntry, TimetableBody>({
      query: (data) => ({ url: "/timetable", method: "post", data }),
      invalidatesTags: ["Timetable"],
    }),
    updateTimetableEntry: build.mutation<
      TimetableEntry,
      { id: number; data: Partial<TimetableBody> }
    >({
      query: ({ id, data }) => ({ url: `/timetable/${id}`, method: "put", data }),
      invalidatesTags: ["Timetable"],
    }),
    deleteTimetableEntry: build.mutation<{ success: boolean }, number>({
      query: (id) => ({ url: `/timetable/${id}`, method: "delete" }),
      invalidatesTags: ["Timetable"],
    }),
  }),
})

export const {
  useGetTimetableQuery,
  useCreateTimetableEntryMutation,
  useUpdateTimetableEntryMutation,
  useDeleteTimetableEntryMutation,
} = timetableApi
