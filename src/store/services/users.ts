import { api } from "@/store/api"
import { toEnvelope, type Envelope, type ListParams } from "./types"

export interface AdminUser {
  id: number
  full_name: string
  phone: string
  email: string
  type: string
  role_name: string
  role?: { id: number; name: string }
  branch_id: number
  employee_id?: number | null
}

export interface UserBody {
  email: string
  full_name: string
  role_id: number
  phone?: string
  branch_id?: number
  /** Links a mentor's account to their Employee record, so they see their own timetable. */
  employee_id?: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface CreateUserResponse extends AdminUser {
  must_change_password: boolean
  email_sent: boolean
  email_error?: string
  /** Only ever returned this one time — the backend doesn't store the plaintext password. */
  login_credentials?: LoginCredentials
}

function normalizeUser(raw: AdminUser): AdminUser {
  const roleName = raw.role?.name ?? raw.role_name
  return {
    ...raw,
    role_name: roleName ? roleName.charAt(0).toUpperCase() + roleName.slice(1) : "",
    type: raw.type || (roleName ? roleName.charAt(0).toUpperCase() + roleName.slice(1) : ""),
  }
}

export const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<Envelope<AdminUser>, ListParams | void>({
      query: (params) => ({ url: "/users", params: params ?? {} }),
      transformResponse: (response: AdminUser[] | Envelope<AdminUser>) => {
        const envelope = toEnvelope(response)
        return { ...envelope, data: envelope.data.map(normalizeUser) }
      },
      providesTags: ["Users"],
    }),
    createUser: build.mutation<CreateUserResponse, UserBody>({
      query: (data) => ({ url: "/users", method: "post", data }),
      invalidatesTags: ["Users"],
    }),
    updateUser: build.mutation<AdminUser, { id: number; data: Partial<UserBody> }>({
      query: ({ id, data }) => ({ url: `/users/${id}`, method: "put", data }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: build.mutation<{ success: boolean }, number>({
      query: (id) => ({ url: `/users/${id}`, method: "delete" }),
      invalidatesTags: ["Users"],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi
