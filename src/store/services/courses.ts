import { api } from "@/store/api"
import type { Envelope, ListParams } from "./types"

export interface Course {
  id: number
  title: string
  name: string
  description?: string | null
  groups: number
  fee: number
  price: number
  duration: string
}

export interface CourseBody {
  name: string
  description?: string
  duration: string
  price: number
}

/** Backend calls it name/price; the UI (built against static mock data) reads title/fee/groups. */
function normalizeCourse(raw: {
  id: number
  name: string
  description?: string | null
  duration: string
  price: number
  _count?: { groups?: number }
}): Course {
  return {
    ...raw,
    title: raw.name,
    fee: raw.price,
    groups: raw._count?.groups ?? 0,
  }
}

export type LeadType = "Lead" | "Client"

export interface Lead {
  id: number
  fullName: string
  full_name?: string
  first_name?: string
  last_name?: string
  phone: string
  lessonTime?: string
  course: string
  course_id?: number | null
  utmSource?: string
  utm_source?: string | null
  occupation?: string
  register?: string
  created_at?: string
  notes?: string
  comment?: string | null
  type: LeadType
}

function normalizeLead(raw: {
  id: number
  full_name?: string
  first_name?: string
  last_name?: string
  phone: string
  course_id?: number | null
  utm_source?: string | null
  comment?: string | null
  created_at?: string
  type?: string
}): Lead {
  const fullName = raw.full_name ?? [raw.first_name, raw.last_name].filter(Boolean).join(" ")
  return {
    ...raw,
    fullName,
    course: raw.course_id ? String(raw.course_id) : "----",
    utmSource: raw.utm_source ?? "-",
    register: raw.created_at ? new Date(raw.created_at).toLocaleDateString("en-US", { month: "long" }) : "-",
    notes: raw.comment ?? "----",
    type: (raw.type === "client" ? "Client" : "Lead") as LeadType,
  }
}

export interface Coupon {
  id: number
  code: string
  course: string
  discount: number
  price: number
  from: string
  to: string
  active: boolean
  logo: "cpp" | "htmlcss" | "js" | "react"
}

function normalizeCoupon(raw: {
  id: number
  code: string
  discount: number
  lead_id?: number | null
  created_at?: string
}): Coupon {
  return {
    ...raw,
    course: "-",
    price: raw.discount,
    from: raw.created_at ? new Date(raw.created_at).toLocaleDateString("en-US") : "-",
    to: "-",
    active: true,
    logo: "js",
  }
}

export interface CoursesParams extends ListParams {}

export const coursesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCourses: build.query<Envelope<Course>, CoursesParams | void>({
      query: (params) => ({ url: "/courses", params: params ?? {} }),
      transformResponse: (response: Envelope<Course>) => ({
        ...response,
        data: response.data.map(normalizeCourse),
      }),
      providesTags: ["Courses"],
    }),
    getCourse: build.query<Course, number>({
      query: (id) => ({ url: `/courses/${id}` }),
      transformResponse: (response: Course) => normalizeCourse(response),
      providesTags: ["Courses"],
    }),
    createCourse: build.mutation<Course, CourseBody>({
      query: (data) => ({ url: "/courses", method: "post", data }),
      invalidatesTags: ["Courses"],
    }),
    updateCourse: build.mutation<Course, { id: number; data: Partial<CourseBody> }>({
      query: ({ id, data }) => ({ url: `/courses/${id}`, method: "put", data }),
      invalidatesTags: ["Courses"],
    }),
    deleteCourse: build.mutation<{ success: boolean }, number>({
      query: (id) => ({ url: `/courses/${id}`, method: "delete" }),
      invalidatesTags: ["Courses"],
    }),

    getLeads: build.query<Envelope<Lead>, ListParams | void>({
      query: (params) => ({ url: "/leads", params: params ?? {} }),
      transformResponse: (response: Envelope<Lead>) => ({
        ...response,
        data: response.data.map(normalizeLead),
      }),
      providesTags: ["Leads"],
    }),
    createLead: build.mutation<Lead, Record<string, unknown>>({
      query: (data) => ({ url: "/leads", method: "post", data }),
      invalidatesTags: ["Leads"],
    }),
    updateLead: build.mutation<Lead, { id: number; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({ url: `/leads/${id}`, method: "put", data }),
      invalidatesTags: ["Leads"],
    }),
    deleteLead: build.mutation<{ success: boolean }, number>({
      query: (id) => ({ url: `/leads/${id}`, method: "delete" }),
      invalidatesTags: ["Leads"],
    }),
    convertLeadToClient: build.mutation<{ success: boolean }, number>({
      query: (id) => ({ url: `/leads/${id}/convert-to-client`, method: "post" }),
      invalidatesTags: ["Leads"],
    }),
    transferLeads: build.mutation<{ success: boolean }, { ids: number[]; course_id: number }>({
      query: (data) => ({ url: "/leads/transfer", method: "post", data }),
      invalidatesTags: ["Leads"],
    }),

    getCoupons: build.query<{ data: Coupon[] }, void>({
      query: () => ({ url: "/leads/coupons" }),
      transformResponse: (response: Coupon[] | { data: Coupon[] }) => ({
        data: (Array.isArray(response) ? response : response.data).map(normalizeCoupon),
      }),
      providesTags: ["Coupons"],
    }),
    createCoupon: build.mutation<Coupon, { code: string; discount: number; lead_id?: number }>({
      query: (data) => ({ url: "/leads/coupons", method: "post", data }),
      invalidatesTags: ["Coupons"],
    }),
  }),
})

export const {
  useGetCoursesQuery,
  useGetCourseQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetLeadsQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useConvertLeadToClientMutation,
  useTransferLeadsMutation,
  useGetCouponsQuery,
  useCreateCouponMutation,
} = coursesApi
