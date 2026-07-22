import { Navigate, Outlet } from "react-router-dom"

import { getRole, homeRouteForRole, isAuthenticated, type Role } from "@/lib/auth"

export function RequireRole({ roles }: { roles: Role[] }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />

  const role = getRole()
  if (!role || !roles.includes(role)) {
    return <Navigate to={role ? homeRouteForRole(role) : "/login"} replace />
  }

  return <Outlet />
}
