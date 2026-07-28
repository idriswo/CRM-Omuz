import { api } from "@/store/api"
import { toEnvelope, type Envelope, type ListParams } from "./types"

export interface Permission {
  id: number
  name: string
  group: string
  enabled: boolean
}

export const permissionsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getPermissions: build.query<
      Envelope<Permission>,
      (ListParams & { filter?: string }) | void
    >({
      query: (params) => ({ url: "/permissions", params: params ?? {} }),
      // The controller answers with a bare `Permission[]`.
      transformResponse: toEnvelope<Permission>,
      providesTags: ["Permissions"],
    }),
    updatePermission: build.mutation<Permission, { id: number; enabled: boolean }>({
      query: ({ id, enabled }) => ({
        url: `/permissions/${id}`,
        method: "put",
        data: { enabled },
      }),
      invalidatesTags: ["Permissions"],
    }),
  }),
})

export const { useGetPermissionsQuery, useUpdatePermissionMutation } = permissionsApi
