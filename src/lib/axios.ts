import axios from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

if (import.meta.env.VITE_USE_MOCKS === "true") {
  const { attachMocks } = await import("@/mocks/attachMocks")
  attachMocks(api)
}
