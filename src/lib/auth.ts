import { decodeJwt } from "./jwt"

export type Role = "student" | "admin" | "superadmin" | "director"

interface JwtPayload {
  role?: string
  sub?: string | number
  id?: string | number
  can_add_students?: boolean
  [key: string]: unknown
}

const TOKEN_KEY = "access_token"
const REFRESH_KEY = "refresh_token"
const ROLE_KEY = "user_role"
const CAN_ADD_STUDENTS_KEY = "can_add_students"

function normalizeRole(value: unknown): Role | null {
  const role = String(value ?? "").toLowerCase()
  if (role === "student" || role === "admin" || role === "superadmin" || role === "director") {
    return role
  }
  return null
}

/**
 * The login response shape isn't guaranteed (no schema in the backend's swagger
 * doc), so we accept the role from wherever it shows up: response.user.role.name,
 * response.user.role, response.role, or — failing that — a `role` claim in the JWT.
 */
export function persistSession(params: {
  access_token: string
  refresh_token?: string
  user?: { role?: { name?: string } | string; can_add_students?: boolean } | null
}) {
  localStorage.setItem(TOKEN_KEY, params.access_token)
  if (params.refresh_token) localStorage.setItem(REFRESH_KEY, params.refresh_token)

  const rawRole =
    (typeof params.user?.role === "object" ? params.user?.role?.name : params.user?.role) ??
    decodeJwt<JwtPayload>(params.access_token)?.role

  const role = normalizeRole(rawRole)
  if (role) localStorage.setItem(ROLE_KEY, role)

  const canAddStudents =
    params.user?.can_add_students ??
    decodeJwt<JwtPayload>(params.access_token)?.can_add_students
  if (canAddStudents !== undefined) {
    localStorage.setItem(CAN_ADD_STUDENTS_KEY, String(canAddStudents))
  }

  return role
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
  localStorage.removeItem(ROLE_KEY)
  localStorage.removeItem(CAN_ADD_STUDENTS_KEY)
}

export function getRole(): Role | null {
  return normalizeRole(localStorage.getItem(ROLE_KEY))
}

export function getCanAddStudents(): boolean {
  return localStorage.getItem(CAN_ADD_STUDENTS_KEY) === "true"
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem(TOKEN_KEY)
}

export function homeRouteForRole(role: Role | null): string {
  if (role === "student") return "/student/profile"
  return "/dashboard"
}
