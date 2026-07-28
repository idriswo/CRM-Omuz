import { api } from "@/store/api"
import { toEnvelope, type Envelope, type ListParams } from "./types"

export type StudentStatus = "active" | "inactive" | "finished"
export type ContractStatus = "active" | "10_day_left" | "finished"
export type GraduateTag =
  | "OpenToWork"
  | "Work"
  | "Freelancer"
  | "Entrepreneur"
  | "FurtherEducation"

export interface StudentGroupRef {
  id: number
  name: string
  period: string
}

export interface StudentPhone {
  label: string
  number: string
}

export interface Student {
  id: number
  full_name: string
  first_name: string
  last_name: string
  birth_date: string
  age: number
  gender: "male" | "female"
  address: string
  email: string
  phone: string
  father_phone: string
  phones: StudentPhone[]
  groups: StudentGroupRef[]
  status: StudentStatus
  has_account: boolean
  contract_status: ContractStatus
  is_top: boolean
  branch_id: number
  telegram_username: string
  description: string
  photo: string | null
}

/**
 * The live backend only sends first_name/last_name, not a precomputed
 * full_name — derive it so every page that reads student.full_name keeps working.
 */
function fillFullName<T extends { full_name?: string; first_name?: string; last_name?: string }>(
  record: T
): T {
  if (record.full_name) return record
  return { ...record, full_name: [record.first_name, record.last_name].filter(Boolean).join(" ") }
}

export interface StudentBody {
  first_name: string
  last_name: string
  birth_date: string
  gender: "male" | "female"
  address: string
  email: string
  status: "active" | "inactive"
  phone: string
  phones: StudentPhone[]
  branch_id: number | null
  telegram_username: string
  description: string
  photo: string | null
}

export interface StudentsParams extends ListParams {
  course_id?: number
  group_id?: number
  contract_status?: ContractStatus
  status?: StudentStatus
}

export interface Graduate {
  id: number
  full_name: string
  age: number
  group: string
  date_of_issue: string
  work_place: string
  serial: string
  has_certificate: boolean
  tag: GraduateTag
  photo: string | null
}

export interface GraduatesStats {
  graduates: number
  employed: number
  open_to_work: number
  freelancer: number
  further_edu: number
}

export interface LeftCourseRow {
  id: number
  full_name: string
  group: string
  mentor: string
  phone: string
  date: string
  reason: string
}

export interface MonthlyPoint {
  month: string
  value: number
}

/** Graduates / Left courses switched to the "Groups" tab: one collapsible row per group. */
export interface GroupedRow<T> {
  id: number
  name: string
  students_count: number
  period: string
  rows: T[]
}

export interface Leader {
  id: number
  rank: number
  full_name: string
  points: number
  phone: string
  group: string
  photo: string | null
}

export interface Winner {
  id: number
  full_name: string
  age: number
  points: number
  group: string
  date: string
  photo: string | null
}

export type ActivityCategory = "Black list" | "Kettle" | "Advanced" | "Handsome" | "ChatGPT"

export interface ActivityRow {
  id: number
  full_name: string
  group: string
  points: number
  category: ActivityCategory
  absence: number
}

export const studentsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getStudents: build.query<Envelope<Student>, StudentsParams | void>({
      query: (params) => ({ url: "/students", params: params ?? {} }),
      transformResponse: (response: Student[] | Envelope<Student>) => {
        const envelope = toEnvelope(response)
        return { ...envelope, data: envelope.data.map(fillFullName) }
      },
      providesTags: ["Students"],
    }),
    getStudent: build.query<Student, number>({
      query: (id) => ({ url: `/students/${id}` }),
      transformResponse: (response: Student) => fillFullName(response),
      providesTags: ["Students"],
    }),
    createStudent: build.mutation<Student, StudentBody>({
      query: (data) => ({ url: "/students", method: "post", data }),
      invalidatesTags: ["Students"],
    }),
    updateStudent: build.mutation<Student, { id: number; data: Partial<StudentBody> }>({
      query: ({ id, data }) => ({ url: `/students/${id}`, method: "put", data }),
      invalidatesTags: ["Students"],
    }),
    deleteStudent: build.mutation<{ success: boolean }, number>({
      query: (id) => ({ url: `/students/${id}`, method: "delete" }),
      invalidatesTags: ["Students", "Groups"],
    }),
    inviteStudentAccount: build.mutation<{ success: boolean }, { id: number; email: string }>({
      query: ({ id, email }) => ({ url: `/students/${id}/invite`, method: "post", data: { email } }),
      invalidatesTags: ["Students"],
    }),

    getGraduates: build.query<
      Envelope<Graduate>,
      (ListParams & { status?: string; course_id?: number; group_id?: number; date?: string }) | void
    >({
      query: (params) => ({ url: "/students/graduates", params: params ?? {} }),
      providesTags: ["Graduates"],
    }),
    getGraduatesStats: build.query<GraduatesStats, void>({
      query: () => ({ url: "/students/graduates/stats" }),
      providesTags: ["Graduates"],
    }),
    updateGraduate: build.mutation<
      Graduate,
      { id: number; data: Partial<Pick<Graduate, "work_place" | "has_certificate" | "tag">> }
    >({
      query: ({ id, data }) => ({ url: `/students/graduates/${id}`, method: "put", data }),
      invalidatesTags: ["Graduates"],
    }),

    getGraduateGroups: build.query<
      Envelope<GroupedRow<Graduate>>,
      (ListParams & { status?: string; course_id?: number; date?: string }) | void
    >({
      query: (params) => ({ url: "/students/graduates/groups", params: params ?? {} }),
      providesTags: ["Graduates"],
    }),

    getLeaders: build.query<Envelope<Leader>, (ListParams & { group_id?: number }) | void>({
      query: (params) => ({ url: "/students/leaders", params: params ?? {} }),
      providesTags: ["Students"],
    }),
    getLeaderWinners: build.query<Envelope<Winner>, void>({
      query: () => ({ url: "/students/leaders/winners" }),
      providesTags: ["Students"],
    }),

    getStudentActivity: build.query<
      Envelope<ActivityRow>,
      (ListParams & { group_id?: number; category?: string; from?: string; to?: string }) | void
    >({
      query: (params) => ({ url: "/students/activity", params: params ?? {} }),
      providesTags: ["Students"],
    }),

    getLeftCourseGroups: build.query<
      Envelope<GroupedRow<LeftCourseRow>>,
      (ListParams & { course_id?: number; date?: string }) | void
    >({
      query: (params) => ({ url: "/students/left-courses/groups", params: params ?? {} }),
      providesTags: ["LeftCourses"],
    }),

    getLeftCourses: build.query<
      Envelope<LeftCourseRow>,
      (ListParams & { course_id?: number; group_id?: number; date?: string }) | void
    >({
      query: (params) => ({ url: "/students/left-courses", params: params ?? {} }),
      providesTags: ["LeftCourses"],
    }),
    getLeftCoursesChart: build.query<{ data: MonthlyPoint[] }, { year: number }>({
      query: (params) => ({ url: "/students/left-courses/chart", params }),
      providesTags: ["LeftCourses"],
    }),

    getEnrolled: build.query<
      Envelope<LeftCourseRow>,
      (ListParams & { group_id?: number; month?: string }) | void
    >({
      query: (params) => ({ url: "/students/enroll", params: params ?? {} }),
      providesTags: ["Students"],
    }),
    getEnrolledChart: build.query<{ data: MonthlyPoint[] }, { year: number }>({
      query: (params) => ({ url: "/students/enroll/chart", params }),
      providesTags: ["Students"],
    }),
    enrollStudent: build.mutation<{ success: boolean }, { student_id: number; group_id: number }>({
      query: (data) => ({ url: "/students/enroll", method: "post", data }),
      invalidatesTags: ["Students", "Groups"],
    }),
  }),
})

export const {
  useGetStudentsQuery,
  useGetStudentQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useInviteStudentAccountMutation,
  useGetGraduatesQuery,
  useGetGraduatesStatsQuery,
  useGetGraduateGroupsQuery,
  useUpdateGraduateMutation,
  useGetLeadersQuery,
  useGetLeaderWinnersQuery,
  useGetStudentActivityQuery,
  useGetLeftCourseGroupsQuery,
  useGetLeftCoursesQuery,
  useGetLeftCoursesChartQuery,
  useGetEnrolledQuery,
  useGetEnrolledChartQuery,
  useEnrollStudentMutation,
} = studentsApi
