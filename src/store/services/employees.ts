import { api } from "@/store/api"
import type { Envelope, ListParams } from "./types"

export type EmployeeRole = "Admin" | "Manager" | "Developer" | "Mentor"
export type EmployeeStatus = "Active" | "Inactive"

export interface Employee {
  id: number
  fullName: string
  first_name: string
  last_name: string
  phone: string
  email?: string | null
  age?: number
  position: string
  roles: EmployeeRole[]
  status: EmployeeStatus
  branch_id?: number | null
  experience?: number | null
  mentor_level?: string | null
  photo?: string
}

export interface EmployeeBody {
  first_name: string
  last_name: string
  birth_date?: string
  phone: string
  email?: string
  address?: string
  position: string
  experience?: number
  branch_id?: number | null
  telegram_username?: string
  description?: string
}

export interface MentorLevelRow {
  id: number
  full_name: string
  level: string
  hourly_rate: number
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}

/** Backend sends first_name/last_name + a single `position` string, not the
 * fullName/roles[]/status/age shape the UI (built against static mock data) expects. */
function normalizeEmployee(raw: {
  id: number
  first_name: string
  last_name: string
  phone: string
  email?: string | null
  position?: string
  branch_id?: number | null
  experience?: number | null
  mentor_level?: string | null
}): Employee {
  return {
    ...raw,
    fullName: [raw.first_name, raw.last_name].filter(Boolean).join(" "),
    position: raw.position ?? "",
    roles: raw.position ? [titleCase(raw.position) as EmployeeRole] : [],
    status: "Active",
  }
}

export interface EmployeesParams extends ListParams {
  branch_id?: number
  position?: string
}

export const employeesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getEmployees: build.query<Envelope<Employee>, EmployeesParams | void>({
      query: (params) => ({ url: "/employees", params: params ?? {} }),
      transformResponse: (response: Envelope<Employee>) => ({
        ...response,
        data: response.data.map(normalizeEmployee),
      }),
      providesTags: ["Employees"],
    }),
    getEmployee: build.query<Employee, number>({
      query: (id) => ({ url: `/employees/${id}` }),
      transformResponse: (response: Employee) => normalizeEmployee(response),
      providesTags: ["Employees"],
    }),
    createEmployee: build.mutation<Employee, FormData | EmployeeBody>({
      query: (data) => ({ url: "/employees", method: "post", data }),
      invalidatesTags: ["Employees"],
    }),
    updateEmployee: build.mutation<Employee, { id: number; data: Partial<EmployeeBody> }>({
      query: ({ id, data }) => ({ url: `/employees/${id}`, method: "put", data }),
      invalidatesTags: ["Employees"],
    }),
    deleteEmployee: build.mutation<{ success: boolean }, number>({
      query: (id) => ({ url: `/employees/${id}`, method: "delete" }),
      invalidatesTags: ["Employees"],
    }),
    getMentorLevels: build.query<{ data: MentorLevelRow[] }, void>({
      query: () => ({ url: "/employees/mentor-levels" }),
      transformResponse: (response: MentorLevelRow[] | { data: MentorLevelRow[] }) => ({
        data: Array.isArray(response) ? response : response.data,
      }),
      providesTags: ["Employees"],
    }),
    updateMentorLevel: build.mutation<MentorLevelRow, { id: number; level: string }>({
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
