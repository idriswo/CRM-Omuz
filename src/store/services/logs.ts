import { api } from "@/store/api"
import type { Envelope } from "./types"

export interface LogEntry {
  id: number
  user: string
  action: string
  entity: string
  date: string
}

export const logsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getLogs: build.query<Envelope<LogEntry>, { search?: string; date?: string } | void>({
      query: (params) => ({ url: "/logs", params: params ?? {} }),
      providesTags: ["Logs"],
    }),
  }),
})

export const { useGetLogsQuery } = logsApi
