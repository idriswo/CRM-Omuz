import { api } from "@/store/api"
import type { Envelope } from "./types"

export interface Branch {
  id: number
  title: string
  city: string
  district: string
  address: string
  groups_count: number
  students_count: number
  status: "Active" | "Inactive"
}

export interface BranchBody {
  title: string
  city: string
  district: string
  address: string
}

export interface BranchChartPoint {
  month: string
  year: number
  Sadbarg: number
  Profsous: number
}

/** Backend returns a bare array (no envelope) and `_count`, not groups_count/status. */
function normalizeBranch(raw: Branch & { _count?: { groups?: number; students?: number } }): Branch {
  return {
    ...raw,
    groups_count: raw.groups_count ?? raw._count?.groups ?? 0,
    students_count: raw.students_count ?? raw._count?.students ?? 0,
    status: raw.status ?? "Active",
  }
}

export const branchesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getBranches: build.query<Envelope<Branch>, { search?: string; year?: number } | void>({
      query: (params) => ({ url: "/branches", params: params ?? {} }),
      transformResponse: (response: Branch[] | Envelope<Branch>) => {
        const list = Array.isArray(response) ? response : response.data
        return {
          data: list.map(normalizeBranch),
          meta: Array.isArray(response)
            ? { total: list.length, page: 1, limit: list.length }
            : response.meta,
        }
      },
      providesTags: ["Branches"],
    }),
    /** Real shape is `{ [branch_id]: { [month_1_to_12]: count } }`, not an
     * array of points — branches-page.tsx reshapes it using the branches list
     * for id -> title, since the raw payload has no branch names in it. */
    getBranchChart: build.query<Record<string, Record<string, number>>, { year: number }>({
      query: (params) => ({ url: "/branches/chart", params }),
      providesTags: ["Branches"],
    }),
    createBranch: build.mutation<Branch, BranchBody>({
      query: (data) => ({ url: "/branches", method: "post", data }),
      invalidatesTags: ["Branches"],
    }),
    updateBranch: build.mutation<Branch, { id: number; data: Partial<BranchBody> }>({
      query: ({ id, data }) => ({ url: `/branches/${id}`, method: "put", data }),
      invalidatesTags: ["Branches"],
    }),
    deleteBranch: build.mutation<{ success: boolean }, number>({
      query: (id) => ({ url: `/branches/${id}`, method: "delete" }),
      invalidatesTags: ["Branches"],
    }),
  }),
})

export const {
  useGetBranchesQuery,
  useGetBranchChartQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
} = branchesApi
