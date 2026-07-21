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

export const branchesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getBranches: build.query<Envelope<Branch>, { search?: string; year?: number } | void>({
      query: (params) => ({ url: "/branches", params: params ?? {} }),
      providesTags: ["Branches"],
    }),
    getBranchChart: build.query<{ data: BranchChartPoint[] }, { year: number }>({
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
