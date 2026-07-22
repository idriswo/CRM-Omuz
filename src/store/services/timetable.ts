import { api } from "@/store/api"

export interface TimetableEntry {
  id: number
  course_name: string
  group_id: number
  type: string
  start_time: string
  end_time: string
  class_room: string
  mentor_id: number
  date: string
  repeat_days: number[]
}

export interface TimetableBody {
  course_name: string
  group_id: number
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
  date?: string
}

/** NOTE: not wired into the Timetable calendar page yet — that page's day/week/
 * month grid rendering was built against static mock data with a much richer
 * shape (positioned events, colors) than these raw backend rows provide. */
export const timetableApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTimetable: build.query<{ data: TimetableEntry[] }, TimetableParams | void>({
      query: (params) => ({ url: "/timetable", params: params ?? {} }),
      transformResponse: (response: TimetableEntry[] | { data: TimetableEntry[] }) => ({
        data: Array.isArray(response) ? response : response.data,
      }),
      providesTags: ["Timetable"],
    }),
    createTimetableEntry: build.mutation<TimetableEntry, TimetableBody>({
      query: (data) => ({ url: "/timetable", method: "post", data }),
      invalidatesTags: ["Timetable"],
    }),
    updateTimetableEntry: build.mutation<TimetableEntry, { id: number; data: Partial<TimetableBody> }>({
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
