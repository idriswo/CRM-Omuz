import { api } from "@/store/api"
import { toEnvelope, type Envelope, type ListParams } from "./types"

/** Exactly what `GET /employees` returns (see backend prisma model `Employee`). */
export interface Employee {
  id: number
  first_name: string
  last_name: string
  /** Free-text on the backend — real values so far: "mentor", "admin", ... */
  position: string
  phone: string
  email?: string | null
  experience?: number | null
  branch_id?: number | null
  created_at?: string
  mentor_level?: MentorLevel | null
  /** Derived client-side for display only. */
  fullName: string
}

export interface MentorLevel {
  id: number
  employee_id: number
  level: string
  employee?: Omit<Employee, "fullName" | "mentor_level">
}

/** Fields `POST /employees` and `PUT /employees/:id` actually persist. */
export interface EmployeeBody {
  first_name: string
  last_name: string
  position: string
  phone: string
  email?: string | null
  experience?: number | null
  branch_id?: number | null
}

type RawEmployee = Omit<Employee, "fullName">

function withFullName(raw: RawEmployee): Employee {
  return { ...raw, fullName: [raw.first_name, raw.last_name].filter(Boolean).join(" ") }
}

export interface EmployeesParams extends ListParams {
  branch_id?: number
  position?: string
}

export const employeesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getEmployees: build.query<Envelope<Employee>, EmployeesParams | void>({
      query: (params) => ({ url: "/employees", params: params ?? {} }),
      transformResponse: (response: RawEmployee[] | Envelope<RawEmployee>) => {
        const envelope = toEnvelope(response)
        return { ...envelope, data: envelope.data.map(withFullName) }
      },
      providesTags: ["Employees"],
    }),
    getEmployee: build.query<Employee, number>({
      query: (id) => ({ url: `/employees/${id}` }),
      transformResponse: withFullName,
      providesTags: ["Employees"],
    }),
    createEmployee: build.mutation<RawEmployee, EmployeeBody>({
      query: (data) => ({ url: "/employees", method: "post", data }),
      invalidatesTags: ["Employees"],
    }),
    updateEmployee: build.mutation<RawEmployee, { id: number; data: Partial<EmployeeBody> }>({
      query: ({ id, data }) => ({ url: `/employees/${id}`, method: "put", data }),
      invalidatesTags: ["Employees"],
    }),
    deleteEmployee: build.mutation<{ success: boolean }, number>({
      query: (id) => ({ url: `/employees/${id}`, method: "delete" }),
      invalidatesTags: ["Employees"],
    }),

    /** `GET /employees/mentor-levels` → MentorLevel[] with the employee included. */
    getMentorLevels: build.query<MentorLevel[], void>({
      query: () => ({ url: "/employees/mentor-levels" }),
      providesTags: ["Employees"],
    }),
    updateMentorLevel: build.mutation<MentorLevel, { id: number; level: string }>({
      query: ({ id, level }) => ({
        url: `/employees/mentor-levels/${id}`,
        method: "put",
        data: { level },
      }),
      invalidatesTags: ["Employees"],
    }),
  }),
})

export const {
  useGetEmployeesQuery,
  useGetEmployeeQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetMentorLevelsQuery,
  useUpdateMentorLevelMutation,
} = employeesApi
