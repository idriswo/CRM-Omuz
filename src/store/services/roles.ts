import { api } from "@/store/api"
import type { Envelope } from "./types"

export interface RoleRow {
  id: number
  name: string
  users_count: number
}

export const rolesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getRoles: build.query<Envelope<RoleRow>, void>({
      query: () => ({ url: "/roles" }),
      providesTags: ["Roles"],
    }),
    createRole: build.mutation<RoleRow, { name: string }>({
      query: (data) => ({ url: "/roles", method: "post", data }),
      invalidatesTags: ["Roles"],
    }),
    updateRole: build.mutation<RoleRow, { id: number; name: string }>({
      query: ({ id, ...data }) => ({ url: `/roles/${id}`, method: "put", data }),
      invalidatesTags: ["Roles"],
    }),
    deleteRole: build.mutation<{ success: boolean }, number>({
      query: (id) => ({ url: `/roles/${id}`, method: "delete" }),
      invalidatesTags: ["Roles"],
    }),
  }),
})

export const {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = rolesApi
