import { api } from "@/store/api"
import type { Envelope, ListParams } from "./types"

export interface AdminUser {
  id: number
  full_name: string
  phone: string
  email: string
  type: string
  role_name: string
  branch_id: number
}

export interface UserBody {
  full_name: string
  phone: string
  email: string
  role_id: number
  branch_id: number
  password: string
}

export const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<Envelope<AdminUser>, ListParams | void>({
      query: (params) => ({ url: "/users", params: params ?? {} }),
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
