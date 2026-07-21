import { api } from "@/store/api"
import type { Envelope, ListParams } from "./types"

export type GroupStatus = "Started" | "Pending" | "Finished"

export interface Group {
  id: number
  name: string
  course: string
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
}

export interface GroupsParams extends ListParams {
  branch_id?: number
  status?: GroupStatus
  course_id?: number
}

export const groupsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getGroups: build.query<Envelope<Group>, GroupsParams | void>({
      query: (params) => ({ url: "/groups", params: params ?? {} }),
      providesTags: ["Groups"],
    }),
    getGroup: build.query<GroupDetail, number>({
      query: (id) => ({ url: `/groups/${id}` }),
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
