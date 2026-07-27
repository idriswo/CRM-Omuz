import { decodeJwt } from "./jwt"

export type Role = "student" | "mentor" | "superadmin" | "director"

interface JwtPayload {
  role?: string
  sub?: string | number
  id?: string | number
  [key: string]: unknown
}

const TOKEN_KEY = "access_token"
const REFRESH_KEY = "refresh_token"
const ROLE_KEY = "user_role"

function normalizeRole(value: unknown): Role | null {
  const role = String(value ?? "").toLowerCase()
  if (role === "student" || role === "mentor" || role === "superadmin" || role === "director") {
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
  user?: { role?: { name?: string } | string } | null
}) {
  localStorage.setItem(TOKEN_KEY, params.access_token)
  if (params.refresh_token) localStorage.setItem(REFRESH_KEY, params.refresh_token)

  const rawRole =
    (typeof params.user?.role === "object" ? params.user?.role?.name : params.user?.role) ??
    decodeJwt<JwtPayload>(params.access_token)?.role

  const role = normalizeRole(rawRole)
  if (role) localStorage.setItem(ROLE_KEY, role)

  return role
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
  localStorage.removeItem(ROLE_KEY)
}

export function getRole(): Role | null {
  return normalizeRole(localStorage.getItem(ROLE_KEY))
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem(TOKEN_KEY)
}

export function homeRouteForRole(role: Role | null): string {
  if (role === "student") return "/student/profile"
  // Mentors have no Dashboard access — see the RBAC doc.
  if (role === "mentor") return "/groups"
  return "/dashboard"
}

/** Students have their own self-service profile screen; staff share `/profile`. */
export function profileRouteForRole(role: Role | null): string {
  return role === "student" ? "/student/profile" : "/profile"
}
