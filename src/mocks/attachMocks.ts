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
import {
  students,
  graduates,
  graduatesStats,
  leftCourses,
  enrolled,
  monthlyChart,
  groups,
  groupStats,
  buildJournal,
  graduateGroups,
  leftCourseGroups,
  leaders,
  winners,
  studentActivity,
  scheduleFor,
  performance,
} from "./academy"

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

  // --- Students ---
  mock.onGet("/students/graduates/stats").reply(200, graduatesStats)
  mock.onGet("/students/graduates/groups").reply(200, {
    data: graduateGroups,
    meta: { total: graduateGroups.length, page: 1, limit: graduateGroups.length },
  })
  mock.onGet("/students/left-courses/groups").reply(200, {
    data: leftCourseGroups,
    meta: { total: leftCourseGroups.length, page: 1, limit: leftCourseGroups.length },
  })

  mock.onGet("/students/leaders/winners").reply(200, {
    data: winners,
    meta: { total: winners.length, page: 1, limit: winners.length },
  })
  mock.onGet("/students/leaders").reply((config) => {
    const { search, page, limit } = config.params ?? {}
    const filtered = leaders.filter((l) => matchesSearch(l.full_name, search))
    return [200, paginate(filtered, Number(page) || 1, Number(limit) || 12)]
  })

  mock.onGet("/students/activity").reply((config) => {
    const { search, page, limit, category, group_id } = config.params ?? {}
    const filtered = studentActivity.filter(
      (a) =>
        matchesSearch(a.full_name, search) &&
        (!category || a.category === category) &&
        (!group_id || a.group === groups.find((g) => g.id === Number(group_id))?.name)
    )
    return [200, paginate(filtered, Number(page) || 1, Number(limit) || 12)]
  })

  mock.onGet("/students/graduates").reply((config) => {
    const { search, page, limit, status } = config.params ?? {}
    const filtered = graduates.filter(
      (g) =>
        (matchesSearch(g.full_name, search) || matchesSearch(g.serial, search)) &&
        (!status || g.tag === status)
    )
    return [200, paginate(filtered, Number(page) || 1, Number(limit) || 10)]
  })
  mock.onPut(/\/students\/graduates\/\d+$/).reply((config) => {
    const id = Number(config.url?.split("/").pop())
    const body = JSON.parse(config.data)
    const idx = graduates.findIndex((g) => g.id === id)
    if (idx !== -1) graduates[idx] = { ...graduates[idx], ...body }
    return [200, graduates[idx]]
  })

  mock.onGet("/students/left-courses/chart").reply(200, { data: monthlyChart(11) })
  mock.onGet("/students/left-courses").reply((config) => {
    const { search, page, limit, group_id } = config.params ?? {}
    const filtered = leftCourses.filter(
      (l) =>
        matchesSearch(l.full_name, search) &&
        (!group_id || l.group === groups.find((g) => g.id === Number(group_id))?.name)
    )
    return [200, paginate(filtered, Number(page) || 1, Number(limit) || 10)]
  })

  mock.onGet("/students/enroll/chart").reply(200, { data: monthlyChart(29) })
  mock.onGet("/students/enroll").reply((config) => {
    const { search, page, limit } = config.params ?? {}
    const filtered = enrolled.filter((e) => matchesSearch(e.full_name, search))
    return [200, paginate(filtered, Number(page) || 1, Number(limit) || 10)]
  })
  mock.onPost("/students/enroll").reply(201, { success: true })

  mock.onGet(/\/students\/\d+$/).reply((config) => {
    const id = Number(config.url?.split("/").pop())
    const student = students.find((s) => s.id === id)
    return student ? [200, student] : [404, { message: "Student not found" }]
  })
  mock.onGet("/students").reply((config) => {
    const { search, page, limit, status, contract_status, group_id } = config.params ?? {}
    const filtered = students.filter(
      (s) =>
        matchesSearch(s.full_name, search) &&
        (!status || s.status === status) &&
        (!contract_status || s.contract_status === contract_status) &&
        (!group_id || s.groups.some((g) => g.id === Number(group_id)))
    )
    return [200, paginate(filtered, Number(page) || 1, Number(limit) || 12)]
  })
  mock.onPost("/students").reply((config) => {
    const body = JSON.parse(config.data)
    const created = {
      ...students[0],
      ...body,
      id: students.length + 1,
      full_name: `${body.last_name ?? ""} ${body.first_name ?? ""}`.trim(),
      groups: [],
    }
    students.unshift(created)
    return [201, created]
  })
  mock.onPut(/\/students\/\d+$/).reply((config) => {
    const id = Number(config.url?.split("/").pop())
    const body = JSON.parse(config.data)
    const idx = students.findIndex((s) => s.id === id)
    if (idx !== -1) {
      students[idx] = { ...students[idx], ...body }
      if (body.first_name || body.last_name) {
        students[idx].full_name = `${students[idx].last_name} ${students[idx].first_name}`.trim()
      }
    }
    return [200, students[idx]]
  })
  mock.onDelete(/\/students\/\d+$/).reply((config) => {
    const id = Number(config.url?.split("/").pop())
    const idx = students.findIndex((s) => s.id === id)
    if (idx !== -1) students.splice(idx, 1)
    return [200, { success: true }]
  })

  // --- Groups ---
  mock.onGet("/groups/stats").reply(200, { data: groupStats })
  mock.onGet(/\/groups\/\d+\/schedule$/).reply((config) => {
    const id = Number(config.url?.split("/")[2])
    return [200, { data: scheduleFor(id) }]
  })
  mock.onPost(/\/groups\/\d+\/schedule$/).reply((config) => {
    const id = Number(config.url?.split("/")[2])
    const slots = scheduleFor(id)
    const created = { id: Math.max(0, ...slots.map((s) => s.id)) + 1, ...JSON.parse(config.data) }
    slots.push(created)
    return [201, created]
  })
  mock.onPut(/\/groups\/\d+\/schedule\/\d+$/).reply((config) => {
    const parts = config.url?.split("/") ?? []
    const slots = scheduleFor(Number(parts[2]))
    const idx = slots.findIndex((s) => s.id === Number(parts[4]))
    if (idx !== -1) slots[idx] = { ...slots[idx], ...JSON.parse(config.data) }
    return [200, slots[idx]]
  })
  mock.onDelete(/\/groups\/\d+\/schedule\/\d+$/).reply((config) => {
    const parts = config.url?.split("/") ?? []
    const slots = scheduleFor(Number(parts[2]))
    const idx = slots.findIndex((s) => s.id === Number(parts[4]))
    if (idx !== -1) slots.splice(idx, 1)
    return [200, { success: true }]
  })
  mock.onGet(/\/groups\/\d+\/journal$/).reply((config) => {
    const id = Number(config.url?.split("/")[2])
    return [200, buildJournal(id)]
  })
  mock.onPost(/\/groups\/\d+\/journal\/week$/).reply(201, { success: true })
  mock.onPut(/\/groups\/\d+\/journal\/\d+\/students\/\d+$/).reply(200, { success: true })
  mock.onGet(/\/groups\/\d+$/).reply((config) => {
    const id = Number(config.url?.split("/").pop())
    const group = groups.find((g) => g.id === id)
    return group ? [200, group] : [404, { message: "Group not found" }]
  })
  mock.onGet("/groups").reply((config) => {
    const { search, page, limit, status, branch_id } = config.params ?? {}
    const filtered = groups.filter(
      (g) =>
        matchesSearch(g.name, search) &&
        (!status || g.status === status) &&
        (!branch_id || g.branch === branches.find((b) => b.id === Number(branch_id))?.title)
    )
    return [200, paginate(filtered, Number(page) || 1, Number(limit) || 12)]
  })
  mock.onPost("/groups").reply((config) => {
    const body = JSON.parse(config.data)
    const created = { ...groups[0], ...body, id: groups.length + 1 }
    groups.unshift(created)
    return [201, created]
  })
  mock.onPut(/\/groups\/\d+$/).reply((config) => {
    const id = Number(config.url?.split("/").pop())
    const body = JSON.parse(config.data)
    const idx = groups.findIndex((g) => g.id === id)
    if (idx !== -1) groups[idx] = { ...groups[idx], ...body }
    return [200, groups[idx]]
  })
  mock.onDelete(/\/groups\/\d+$/).reply((config) => {
    const id = Number(config.url?.split("/").pop())
    const idx = groups.findIndex((g) => g.id === id)
    if (idx !== -1) groups.splice(idx, 1)
    return [200, { success: true }]
  })

  // --- Profile (not yet in endpoints.md, used by Profile page) ---
  mock.onGet("/me").reply(200, currentUser)
  mock.onGet("/me/birthdays").reply(200, { data: upcomingBirthdays })
  mock.onGet("/me/groups").reply(200, { data: myGroups })
  mock.onGet("/me/performance").reply(200, performance)

  mock.onAny().passThrough()
}
