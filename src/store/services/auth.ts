import { api } from "@/store/api"

export interface LoginBody {
  email: string
  password: string
}

export interface AuthResponse {
  access_token: string
  refresh_token?: string
  must_change_password?: boolean
  user?: {
    id?: number
    full_name?: string
    role?: string | { name?: string }
  } | null
}

export interface ForgotPasswordBody {
  email: string
}

export interface VerifyResetCodeBody {
  email: string
  code: string
}

export interface VerifyResetCodeResponse {
  success: boolean
  valid: boolean
  reset_token: string
  expires_in_minutes: number
}

export interface ResetPasswordBody {
  reset_token: string
  new_password: string
}

export interface ChangePasswordBody {
  old_password: string
  new_password: string
}

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthResponse, LoginBody>({
      query: (body) => ({ url: "/auth/login", method: "post", data: body }),
    }),
    forgotPassword: build.mutation<{ message: string }, ForgotPasswordBody>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "post",
        data: body,
      }),
    }),
    verifyResetCode: build.mutation<VerifyResetCodeResponse, VerifyResetCodeBody>({
      query: (body) => ({
        url: "/auth/verify-reset-code",
        method: "post",
        data: body,
      }),
    }),
    resetPassword: build.mutation<{ success: boolean }, ResetPasswordBody>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "post",
        data: body,
      }),
    }),
    changePassword: build.mutation<{ success: boolean }, ChangePasswordBody>({
      query: (body) => ({
        url: "/auth/change-password",
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
  useForgotPasswordMutation,
  useVerifyResetCodeMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useLogoutMutation,
} = authApi
