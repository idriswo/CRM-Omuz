import { api } from "@/store/api"

export interface LoginBody {
  phone: string
  password: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: { id: number; full_name: string; role: string }
}

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthResponse, LoginBody>({
      query: (body) => ({ url: "/auth/login", method: "post", data: body }),
    }),
    register: build.mutation<{ success: boolean }, Record<string, unknown>>({
      query: (body) => ({ url: "/auth/register", method: "post", data: body }),
    }),
    forgotPassword: build.mutation<{ success: boolean }, { email: string }>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "post",
        data: body,
      }),
    }),
    verifyResetCode: build.mutation<{ success: boolean }, { email: string; code: string }>({
      query: (body) => ({
        url: "/auth/verify-reset-code",
        method: "post",
        data: body,
      }),
    }),
    resetPassword: build.mutation<
      { success: boolean },
      { email: string; code: string; password: string }
    >({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "post",
        data: body,
      }),
    }),
    logout: build.mutation<{ success: boolean }, void>({
      query: () => ({ url: "/auth/logout", method: "post" }),
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useVerifyResetCodeMutation,
  useResetPasswordMutation,
  useLogoutMutation,
} = authApi
