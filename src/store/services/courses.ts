import { api } from "@/store/api"
import type { Envelope, ListParams } from "./types"

/** Exactly what `GET /courses` returns (backend prisma model `Course`). */
export interface Course {
  id: number
  name: string
  description?: string | null
  duration: string
  price: number
}

export interface CourseBody {
  name: string
  description?: string | null
  duration: string
  price: number
}

export type LeadType = "Lead" | "Client"

/** Exactly what `GET /leads` returns (backend prisma model `Lead`). */
export interface Lead {
  id: number
  full_name: string
  phone: string
  lesson_time?: string | null
  course_id?: number | null
  utm_source?: string | null
  occupation?: string | null
  notes?: string | null
  type: LeadType
  created_at: string
}

export interface LeadBody {
  full_name: string
  phone: string
  lesson_time?: string | null
  course_id?: number | null
  utm_source?: string | null
  occupation?: string | null
  notes?: string | null
}

/** Exactly what `GET /leads/coupons` returns (backend prisma model `Coupon`). */
export interface Coupon {
  id: number
  code: string
  discount: number
  lead_id?: number | null
  created_at: string
}

export interface CouponBody {
  code: string
  discount: number
  lead_id?: number | null
}

/** Filters the backend's `leadsWhere()` actually understands. */
export interface LeadsParams extends ListParams {
  course_id?: number
  type?: LeadType
  utm_source?: string
}

export const coursesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCourses: build.query<Envelope<Course>, ListParams | void>({
      query: (params) => ({ url: "/courses", params: params ?? {} }),
      providesTags: ["Courses"],
    }),
    getCourse: build.query<Course, number>({
      query: (id) => ({ url: `/courses/${id}` }),
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

    getLeads: build.query<Envelope<Lead>, LeadsParams | void>({
      query: (params) => ({ url: "/leads", params: params ?? {} }),
      providesTags: ["Leads"],
    }),
    createLead: build.mutation<Lead, LeadBody>({
      query: (data) => ({ url: "/leads", method: "post", data }),
      invalidatesTags: ["Leads"],
    }),
    updateLead: build.mutation<Lead, { id: number; data: Partial<LeadBody> }>({
      query: ({ id, data }) => ({ url: `/leads/${id}`, method: "put", data }),
      invalidatesTags: ["Leads"],
    }),
    deleteLead: build.mutation<{ success: boolean }, number>({
      query: (id) => ({ url: `/leads/${id}`, method: "delete" }),
      invalidatesTags: ["Leads"],
    }),
    convertLeadToClient: build.mutation<Lead, number>({
      query: (id) => ({ url: `/leads/${id}/convert-to-client`, method: "post" }),
      invalidatesTags: ["Leads"],
    }),
    /** Backend body: `{ lead_ids: number[], target_course_id: number }`. */
    transferLeads: build.mutation<
      { success: boolean; count: number },
      { lead_ids: number[]; target_course_id: number }
    >({
      query: (data) => ({ url: "/leads/transfer", method: "post", data }),
      invalidatesTags: ["Leads"],
    }),

    getCoupons: build.query<Coupon[], void>({
      query: () => ({ url: "/leads/coupons" }),
      providesTags: ["Coupons"],
    }),
    createCoupon: build.mutation<Coupon, CouponBody>({
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
