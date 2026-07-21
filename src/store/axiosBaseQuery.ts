import type { BaseQueryFn } from "@reduxjs/toolkit/query"
import type { AxiosError, AxiosRequestConfig } from "axios"

import { api } from "@/lib/axios"

type AxiosBaseQueryArgs = {
  url: string
  method?: AxiosRequestConfig["method"]
  data?: AxiosRequestConfig["data"]
  params?: AxiosRequestConfig["params"]
}

export const axiosBaseQuery =
  (): BaseQueryFn<AxiosBaseQueryArgs, unknown, { status?: number; data: unknown }> =>
  async ({ url, method = "get", data, params }) => {
    try {
      const result = await api.request({ url, method, data, params })
      return { data: result.data }
    } catch (err) {
      const error = err as AxiosError
      return {
        error: {
          status: error.response?.status,
          data: error.response?.data ?? error.message,
        },
      }
    }
  }
