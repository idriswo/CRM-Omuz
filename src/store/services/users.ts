import { api } from "@/store/api"
import type { Envelope, ListParams } from "./types"

export interface AdminUser {
  id: number
  full_name: string
  phone: string
  email: string
  type: string
  role_name: string
  role?: { id: number; name: string }
  branch_id: number
  can_add_students?: boolean
}

export interface UserBody {
  full_name: string
  phone: string
  email: string
  role_id: number
  branch_id: number
  password: string
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
      transformResponse: (response: Envelope<AdminUser>) => ({
        ...response,
        data: response.data.map(normalizeUser),
      }),
      providesTags: ["Users"],
    }),
    createUser: build.mutation<AdminUser, UserBody>({
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
