import axios, { type AxiosError } from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  timeout: 90000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * Render's free tier spins the backend down after ~15min idle; the request that
 * wakes it back up can take 30-60s and may bounce with a 502/timeout in the
 * meantime. Treat that as a cold start, not a real failure: retry a couple of
 * times with backoff before giving up.
 */
const COLD_START_RETRY_DELAYS = [4000, 10000, 20000]

function isColdStartError(error: AxiosError) {
  if (error.code === "ECONNABORTED") return true
  const status = error.response?.status
  return status === 502 || status === 503 || status === 504
}

/** Set by whoever mounts the change-password screen, so this module (outside React) can redirect. */
let onMustChangePassword: (() => void) | null = null
export function registerMustChangePasswordHandler(handler: () => void) {
  onMustChangePassword = handler
}

function isMustChangePasswordError(error: AxiosError) {
  const data = error.response?.data as { must_change_password?: boolean } | undefined
  return error.response?.status === 403 && data?.must_change_password === true
}

api.interceptors.response.use(undefined, async (error: AxiosError) => {
  if (isMustChangePasswordError(error) && !error.config?.url?.includes("/auth/")) {
    onMustChangePassword?.()
  }

  const config = error.config as (typeof error.config & { __retryCount?: number }) | undefined
  if (!config || !isColdStartError(error)) return Promise.reject(error)

  config.__retryCount = config.__retryCount ?? 0
  if (config.__retryCount >= COLD_START_RETRY_DELAYS.length) return Promise.reject(error)

  const delay = COLD_START_RETRY_DELAYS[config.__retryCount]
  config.__retryCount += 1
  await new Promise((resolve) => setTimeout(resolve, delay))
  return api(config)
})

// Fire-and-forget warm-up ping so the backend is (hopefully) already awake
// by the time the user submits the login form.
api.get("/branches").catch(() => {})
