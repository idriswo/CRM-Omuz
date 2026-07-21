import type { AxiosInstance } from "axios"
import MockAdapter from "axios-mock-adapter"

import {
  users,
  permissions,
  roles,
  logs,
  branches,
  branchChart,
  currentUser,
  upcomingBirthdays,
  myGroups,
  type AdminUser,
} from "./data"

function paginate<T>(list: T[], page = 1, limit = 10) {
  const start = (page - 1) * limit
  return {
    data: list.slice(start, start + limit),
    meta: { total: list.length, page, limit },
  }
}

function matchesSearch(value: string, search?: string) {
  if (!search) return true
  return value.toLowerCase().includes(search.toLowerCase())
}

/**
 * Dev-only mock backend so the UI is fully clickable before the real API exists.
 * Turn it off by setting VITE_USE_MOCKS=false once the backend is reachable —
 * every request shape below mirrors endpoints.md, so no call-site changes are needed.
 */
export function attachMocks(axiosInstance: AxiosInstance) {
  const mock = new MockAdapter(axiosInstance, { delayResponse: 350 })

  // --- Auth ---
  mock.onPost("/auth/login").reply(200, {
    access_token: "mock-access-token",
    refresh_token: "mock-refresh-token",
    user: currentUser,
  })
  mock.onPost("/auth/register").reply(201, { success: true })
  mock.onPost("/auth/forgot-password").reply(200, { success: true })
  mock.onPost("/auth/verify-reset-code").reply((config) => {
    const body = JSON.parse(config.data)
    if (!/^\d{6}$/.test(body.code)) {
      return [400, { message: "Enter the 6-digit code." }]
    }
    return [200, { success: true }]
  })
  mock.onPost("/auth/reset-password").reply(200, { success: true })
  mock.onPost("/auth/refresh-token").reply(200, {
    access_token: "mock-access-token",
    refresh_token: "mock-refresh-token",
  })
  mock.onPost("/auth/logout").reply(200, { success: true })

  // --- Users ---
  mock.onGet("/users").reply((config) => {
    const { search, page, limit } = config.params ?? {}
    const filtered = users.filter((u) => matchesSearch(u.full_name, search))
    return [200, paginate(filtered, Number(page) || 1, Number(limit) || 10)]
  })
  mock.onPost("/users").reply((config) => {
    const body = JSON.parse(config.data)
    const created: AdminUser = {
      id: users.length + 1,
      role_name: "Student",
      type: "Student",
      ...body,
    }
    users.unshift(created)
    return [201, created]
  })
  mock.onPut(/\/users\/\d+/).reply((config) => {
    const id = Number(config.url?.split("/").pop())
    const body = JSON.parse(config.data)
    const idx = users.findIndex((u) => u.id === id)
    if (idx !== -1) users[idx] = { ...users[idx], ...body }
    return [200, users[idx]]
  })
  mock.onDelete(/\/users\/\d+/).reply((config) => {
    const id = Number(config.url?.split("/").pop())
    const idx = users.findIndex((u) => u.id === id)
    if (idx !== -1) users.splice(idx, 1)
    return [200, { success: true }]
  })

  // --- Permissions ---
  mock.onGet("/permissions").reply((config) => {
    const { search, filter } = config.params ?? {}
    const filtered = permissions.filter(
      (p) =>
        matchesSearch(p.name, search) && (!filter || filter === "All permission" || p.group === filter)
    )
    return [200, paginate(filtered, 1, filtered.length || 1)]
  })
  mock.onPut(/\/permissions\/\d+/).reply((config) => {
    const id = Number(config.url?.split("/").pop())
    const body = JSON.parse(config.data)
    const idx = permissions.findIndex((p) => p.id === id)
    if (idx !== -1) permissions[idx].enabled = body.enabled
    return [200, permissions[idx]]
  })

  // --- Roles ---
  mock.onGet("/roles").reply(200, paginate(roles, 1, roles.length))
  mock.onPost("/roles").reply((config) => {
    const body = JSON.parse(config.data)
    const created = { id: roles.length + 1, users_count: 0, ...body }
    roles.push(created)
    return [201, created]
  })
  mock.onPut(/\/roles\/\d+/).reply((config) => {
    const id = Number(config.url?.split("/").pop())
    const body = JSON.parse(config.data)
    const idx = roles.findIndex((r) => r.id === id)
    if (idx !== -1) roles[idx] = { ...roles[idx], ...body }
    return [200, roles[idx]]
  })
  mock.onDelete(/\/roles\/\d+/).reply((config) => {
    const id = Number(config.url?.split("/").pop())
    const idx = roles.findIndex((r) => r.id === id)
    if (idx !== -1) roles.splice(idx, 1)
    return [200, { success: true }]
  })

  // --- Logs ---
  mock.onGet("/logs").reply((config) => {
    const { search } = config.params ?? {}
    const filtered = logs.filter((l) => matchesSearch(l.action, search))
    return [200, paginate(filtered, 1, filtered.length || 1)]
  })

  // --- Branches ---
  mock.onGet("/branches/chart").reply((config) => {
    const year = Number(config.params?.year) || new Date().getFullYear()
    return [200, { data: branchChart(year) }]
  })
  mock.onGet("/branches").reply((config) => {
    const { search } = config.params ?? {}
    const filtered = branches.filter((b) => matchesSearch(b.title, search))
    return [200, paginate(filtered, 1, filtered.length || 1)]
  })
  mock.onPost("/branches").reply((config) => {
    const body = JSON.parse(config.data)
    const created = {
      id: branches.length + 1,
      groups_count: 0,
      students_count: 0,
      status: "Active" as const,
      ...body,
    }
    branches.push(created)
    return [201, created]
  })
  mock.onPut(/\/branches\/\d+/).reply((config) => {
    const id = Number(config.url?.split("/").pop())
    const body = JSON.parse(config.data)
    const idx = branches.findIndex((b) => b.id === id)
    if (idx !== -1) branches[idx] = { ...branches[idx], ...body }
    return [200, branches[idx]]
  })
  mock.onDelete(/\/branches\/\d+/).reply((config) => {
    const id = Number(config.url?.split("/").pop())
    const idx = branches.findIndex((b) => b.id === id)
    if (idx !== -1) branches.splice(idx, 1)
    return [200, { success: true }]
  })

  // --- Profile (not yet in endpoints.md, used by Profile page) ---
  mock.onGet("/me").reply(200, currentUser)
  mock.onGet("/me/birthdays").reply(200, { data: upcomingBirthdays })
  mock.onGet("/me/groups").reply(200, { data: myGroups })

  mock.onAny().passThrough()
}
