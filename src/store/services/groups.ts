import { api } from "@/store/api"
import { toEnvelope, type Envelope, type ListParams } from "./types"

export type GroupStatus = "Started" | "Pending" | "Finished"

export interface Group {
  id: number
  name: string
  course: string
  course_id?: number
  start_date: string
  end_date: string
  duration: string
  required_students: number
  passing_students: number
  capacity: number
  days: string
  time: string
  branch: string
  status: GroupStatus
}

export interface GroupStudent {
  id: number
  full_name: string
  phone: string
  father_phone: string
  has_account: boolean
  status: "Active" | "Inactive"
}

export interface GroupLeftStudent {
  id: number
  full_name: string
  phone: string
  has_account: boolean
  reason: string
}

export interface GroupDetail extends Group {
  mentors: string[]
  students: GroupStudent[]
  left_course: GroupLeftStudent[]
}

export type Weekday = "Mn" | "Tu" | "Wd" | "Th" | "Fr" | "Sa" | "Su"

export const weekdayNames: Record<Weekday, string> = {
  Mn: "Monday",
  Tu: "Tuesday",
  Wd: "Wednesday",
  Th: "Thursday",
  Fr: "Friday",
  Sa: "Saturday",
  Su: "Sunday",
}

export interface ScheduleSlot {
  id: number
  weekday: Weekday
  start: string
  end: string
}

export interface GroupTagStat {
  label: string
  count: number
  color: string
}

export interface GroupBody {
  name: string
  course_id: number | null
  start_date: string
  end_date: string
  duration: string
  required_students: number
  branch_id: number | null
  description?: string
  duration_type?: string
  status?: GroupStatus | ""
  format?: string
  telegram_link?: string
}

export interface GroupsParams extends ListParams {
  branch_id?: number
  status?: GroupStatus
  course_id?: number
}

const STATUS_MAP: Record<string, GroupStatus> = {
  active: "Started",
  started: "Started",
  pending: "Pending",
  finished: "Finished",
  completed: "Finished",
}

/** Backend sends lowercase status + `_count.students`, not the capacity/passing fields we render. */
function normalizeGroup(raw: Group & { _count?: { students?: number } }): Group {
  return {
    ...raw,
    status: STATUS_MAP[String(raw.status).toLowerCase()] ?? raw.status,
    passing_students: raw.passing_students ?? raw._count?.students ?? 0,
    capacity: raw.capacity ?? raw.required_students,
  }
}

export const groupsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getGroups: build.query<Envelope<Group>, GroupsParams | void>({
      query: (params) => ({ url: "/groups", params: params ?? {} }),
      transformResponse: (response: Group[] | Envelope<Group>) => {
        const envelope = toEnvelope(response)
        return { ...envelope, data: envelope.data.map(normalizeGroup) }
      },
      providesTags: ["Groups"],
    }),
    getGroup: build.query<GroupDetail, number>({
      query: (id) => ({ url: `/groups/${id}` }),
      transformResponse: (response: GroupDetail) => {
        const normalized = normalizeGroup(response) as GroupDetail
        return {
          ...normalized,
          mentors: normalized.mentors ?? [],
          left_course: normalized.left_course ?? [],
          students: (normalized.students ?? []).map((s) => ({
            ...s,
            full_name:
              s.full_name ||
              [
                (s as unknown as { first_name?: string }).first_name,
                (s as unknown as { last_name?: string }).last_name,
              ]
                .filter(Boolean)
                .join(" "),
          })),
        }
      },
      providesTags: ["Groups"],
    }),
    getGroupStats: build.query<{ data: GroupTagStat[] }, void>({
      query: () => ({ url: "/groups/stats" }),
      providesTags: ["Groups"],
    }),
    getGroupSchedule: build.query<{ data: ScheduleSlot[] }, number>({
      query: (id) => ({ url: `/groups/${id}/schedule` }),
      providesTags: ["Schedule"],
    }),
    addScheduleSlot: build.mutation<
      ScheduleSlot,
      { groupId: number; data: Omit<ScheduleSlot, "id"> }
    >({
      query: ({ groupId, data }) => ({
        url: `/groups/${groupId}/schedule`,
        method: "post",
        data,
      }),
      invalidatesTags: ["Schedule"],
    }),
    updateScheduleSlot: build.mutation<
      ScheduleSlot,
      { groupId: number; id: number; data: Partial<Omit<ScheduleSlot, "id">> }
    >({
      query: ({ groupId, id, data }) => ({
        url: `/groups/${groupId}/schedule/${id}`,
        method: "put",
        data,
      }),
      invalidatesTags: ["Schedule"],
    }),
    deleteScheduleSlot: build.mutation<{ success: boolean }, { groupId: number; id: number }>({
      query: ({ groupId, id }) => ({
        url: `/groups/${groupId}/schedule/${id}`,
        method: "delete",
      }),
      invalidatesTags: ["Schedule"],
    }),
    createGroup: build.mutation<Group, GroupBody>({
      query: (data) => ({ url: "/groups", method: "post", data }),
      invalidatesTags: ["Groups"],
    }),
    updateGroup: build.mutation<Group, { id: number; data: Partial<GroupBody> }>({
      query: ({ id, data }) => ({ url: `/groups/${id}`, method: "put", data }),
      invalidatesTags: ["Groups"],
    }),
    deleteGroup: build.mutation<{ success: boolean }, number>({
      query: (id) => ({ url: `/groups/${id}`, method: "delete" }),
      invalidatesTags: ["Groups"],
    }),
  }),
})

export const {
  useGetGroupsQuery,
  useGetGroupQuery,
  useGetGroupStatsQuery,
  useGetGroupScheduleQuery,
  useAddScheduleSlotMutation,
  useUpdateScheduleSlotMutation,
  useDeleteScheduleSlotMutation,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
} = groupsApi
