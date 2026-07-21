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
  payments,
  budgetRows,
  budgetChart,
  salaryRows,
  avansRows,
  debtorRows,
  expenseRows,
  netRows,
  accountantRows,
  accountantChart,
  accountingStats,
  accountingChart,
  studentsPaymentDonut,
  studentsPaymentGroups,
  smsTemplates,
  smsHistory,
  smsGroups,
  smsStudents,
  smsMentors,
  smsLeads,
  smsGraduates,
  dashboardStats,
  attendanceLog,
  groupsSummary,
  leadsChart,
  attendanceChartDash,
  incomeThisMonth,
  enrollChart,
  enrollList,
  employedGraduates,
  leftCourses,
  appNotifications,
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

  // --- Accounting: overview ---
  mock.onGet("/accounting/overview").reply(200, accountingStats)
  mock.onGet("/accounting/overview/chart").reply((config) => {
    const year = Number(config.params?.year) || new Date().getFullYear()
    return [200, { data: accountingChart(year) }]
  })
  mock.onGet("/accounting/overview/students-payment").reply(200, {
    donut: studentsPaymentDonut,
    groups: studentsPaymentGroups,
  })

  // --- Accounting: payments ---
  mock.onGet("/payments").reply((config) => {
    const { search, group_id, branch_id, status } = config.params ?? {}
    const filtered = payments.filter(
      (p) =>
        matchesSearch(p.full_name, search) &&
        (!group_id || group_id === "all" || p.group === group_id) &&
        (!branch_id || branch_id === "all" || p.branch === branch_id) &&
        (!status || status === "all" || p.status.toLowerCase() === String(status).toLowerCase())
    )
    return [200, paginate(filtered, 1, filtered.length || 1)]
  })
  mock.onPost("/payments/prepayment").reply(201, { success: true })
  mock.onPost("/payments").reply((config) => {
    const body = JSON.parse(config.data)
    const created = { id: payments.length + 1, discount: 0, status: "Active" as const, ...body }
    payments.unshift(created)
    return [201, created]
  })
  mock.onPut(/\/payments\/\d+/).reply((config) => {
    const id = Number(config.url?.split("/").pop())
    const body = JSON.parse(config.data)
    const idx = payments.findIndex((p) => p.id === id)
    if (idx !== -1) payments[idx] = { ...payments[idx], ...body }
    return [200, payments[idx]]
  })
  mock.onDelete(/\/payments\/\d+/).reply((config) => {
    const id = Number(config.url?.split("/").pop())
    const idx = payments.findIndex((p) => p.id === id)
    if (idx !== -1) payments.splice(idx, 1)
    return [200, { success: true }]
  })

  // --- Accounting: budget ---
  mock.onGet("/accounting/budget/chart").reply((config) => {
    const { from, to } = config.params ?? {}
    return [200, { data: budgetChart(Number(from) || 0, Number(to) || 11) }]
  })
  mock.onGet("/accounting/budget").reply((config) => {
    const { status } = config.params ?? {}
    const filtered = budgetRows.filter((b) => !status || status === "all" || b.status.toLowerCase() === String(status).toLowerCase())
    return [200, paginate(filtered, 1, filtered.length || 1)]
  })
  mock.onPost("/accounting/budget").reply((config) => {
    const body = JSON.parse(config.data)
    const created = { id: budgetRows.length + 1, status: "Active" as const, ...body }
    budgetRows.unshift(created)
    return [201, created]
  })
  mock.onPut(/\/accounting\/budget\/\d+/).reply((config) => {
    const id = Number(config.url?.split("/").pop())
    const body = JSON.parse(config.data)
    const idx = budgetRows.findIndex((b) => b.id === id)
    if (idx !== -1) budgetRows[idx] = { ...budgetRows[idx], ...body }
    return [200, budgetRows[idx]]
  })

  // --- Accounting: salary ---
  mock.onGet("/accounting/salary").reply((config) => {
    const { search, date } = config.params ?? {}
    const filtered = salaryRows.filter((s) => matchesSearch(s.full_name, search) && (!date || date === "all" || s.month === date))
    return [200, paginate(filtered, 1, filtered.length || 1)]
  })
  mock.onPost("/accounting/salary").reply((config) => {
    const body = JSON.parse(config.data)
    const created = { id: salaryRows.length + 1, status: "Active" as const, ...body }
    salaryRows.unshift(created)
    return [201, created]
  })
  mock.onPut(/\/accounting\/salary\/\d+/).reply((config) => {
    const id = Number(config.url?.split("/").pop())
    const body = JSON.parse(config.data)
    const idx = salaryRows.findIndex((s) => s.id === id)
    if (idx !== -1) salaryRows[idx] = { ...salaryRows[idx], ...body }
    return [200, salaryRows[idx]]
  })
  mock.onDelete(/\/accounting\/salary\/\d+/).reply((config) => {
    const id = Number(config.url?.split("/").pop())
    const idx = salaryRows.findIndex((s) => s.id === id)
    if (idx !== -1) salaryRows.splice(idx, 1)
    return [200, { success: true }]
  })

  // --- Accounting: avans ---
  mock.onGet("/accounting/avans").reply((config) => {
    const { search, status } = config.params ?? {}
    const filtered = avansRows.filter((a) => matchesSearch(a.full_name, search) && (!status || status === "all" || a.status === status))
    return [200, paginate(filtered, 1, filtered.length || 1)]
  })
  mock.onPut(/\/accounting\/avans\/\d+/).reply((config) => {
    const id = Number(config.url?.split("/").pop())
    const body = JSON.parse(config.data)
    const idx = avansRows.findIndex((a) => a.id === id)
    if (idx !== -1) avansRows[idx] = { ...avansRows[idx], ...body }
    return [200, avansRows[idx]]
  })

  // --- Accounting: debtors ---
  mock.onGet("/accounting/debtors").reply((config) => {
    const { search, status } = config.params ?? {}
    const filtered = debtorRows.filter((d) => matchesSearch(d.full_name, search) && (!status || status === "all" || d.status.toLowerCase() === String(status).toLowerCase()))
    return [200, paginate(filtered, 1, filtered.length || 1)]
  })
  mock.onPost("/accounting/debtors").reply((config) => {
    const body = JSON.parse(config.data)
    const created = { id: debtorRows.length + 1, status: "Inprogress" as const, ...body }
    debtorRows.unshift(created)
    return [201, created]
  })
  mock.onPut(/\/accounting\/debtors\/\d+/).reply((config) => {
    const id = Number(config.url?.split("/").pop())
    const body = JSON.parse(config.data)
    const idx = debtorRows.findIndex((d) => d.id === id)
    if (idx !== -1) debtorRows[idx] = { ...debtorRows[idx], ...body }
    return [200, debtorRows[idx]]
  })

  // --- Accounting: expenses ---
  mock.onGet("/accounting/expenses").reply((config) => {
    const { category, branch_id } = config.params ?? {}
    const filtered = expenseRows.filter(
      (e) => (!category || category === "all" || e.name === category) && (!branch_id || branch_id === "all" || e.branch === branch_id)
    )
    return [200, { data: filtered }]
  })
  mock.onPut(/\/accounting\/expenses\/\d+/).reply((config) => {
    const id = Number(config.url?.split("/").pop())
    const body = JSON.parse(config.data)
    const idx = expenseRows.findIndex((e) => e.id === id)
    if (idx !== -1) expenseRows[idx] = { ...expenseRows[idx], ...body }
    return [200, expenseRows[idx]]
  })

  // --- Accounting: net ---
  mock.onGet("/accounting/net").reply((config) => {
    const { category } = config.params ?? {}
    const filtered = netRows.filter((n) => !category || category === "all" || n.category === category)
    return [200, paginate(filtered, 1, filtered.length || 1)]
  })

  // --- Accounting: accountant ---
  mock.onGet("/accounting/accountant/chart").reply((config) => {
    const year = Number(config.params?.year) || new Date().getFullYear()
    return [200, { data: accountantChart(year) }]
  })
  mock.onGet("/accounting/accountant").reply((config) => {
    const { status, branch_id } = config.params ?? {}
    const filtered = accountantRows.filter(
      (a) => (!status || status === "all" || a.status.toLowerCase() === String(status).toLowerCase()) && (!branch_id || branch_id === "all" || a.branch === branch_id)
    )
    return [200, paginate(filtered, 1, filtered.length || 1)]
  })

  // --- SMS mailings ---
  mock.onGet("/sms/templates").reply(200, { data: smsTemplates })
  mock.onPost("/sms/templates").reply((config) => {
    const body = JSON.parse(config.data)
    const created = { id: smsTemplates.length + 1, ...body }
    smsTemplates.unshift(created)
    return [201, created]
  })
  mock.onPut(/\/sms\/templates\/\d+/).reply((config) => {
    const id = Number(config.url?.split("/").pop())
    const body = JSON.parse(config.data)
    const idx = smsTemplates.findIndex((t) => t.id === id)
    if (idx !== -1) smsTemplates[idx] = { ...smsTemplates[idx], ...body }
    return [200, smsTemplates[idx]]
  })
  mock.onDelete(/\/sms\/templates\/\d+/).reply((config) => {
    const id = Number(config.url?.split("/").pop())
    const idx = smsTemplates.findIndex((t) => t.id === id)
    if (idx !== -1) smsTemplates.splice(idx, 1)
    return [200, { success: true }]
  })
  mock.onGet("/sms/recipients/group").reply(200, { data: smsGroups })
  mock.onGet("/sms/recipients/students").reply((config) => {
    const { search } = config.params ?? {}
    return [200, { data: smsStudents.filter((s) => matchesSearch(s.full_name, search)) }]
  })
  mock.onGet("/sms/recipients/mentors").reply((config) => {
    const { search } = config.params ?? {}
    return [200, { data: smsMentors.filter((s) => matchesSearch(s.full_name, search)) }]
  })
  mock.onGet("/sms/recipients/leads").reply((config) => {
    const { search } = config.params ?? {}
    return [200, { data: smsLeads.filter((s) => matchesSearch(s.full_name, search)) }]
  })
  mock.onGet("/sms/recipients/graduates").reply((config) => {
    const { search } = config.params ?? {}
    return [200, { data: smsGraduates.filter((s) => matchesSearch(s.full_name, search)) }]
  })
  mock.onPost("/sms/send").reply(200, { success: true })
  mock.onGet("/sms/history").reply((config) => {
    const { search } = config.params ?? {}
    const filtered = smsHistory.filter((h) => matchesSearch(h.title, search))
    return [200, paginate(filtered, 1, filtered.length || 1)]
  })

  // --- Dashboard ---
  mock.onGet("/dashboard/stats").reply(200, dashboardStats)
  mock.onGet("/dashboard/attendance-log").reply(200, { data: attendanceLog })
  mock.onGet("/dashboard/groups-summary").reply(200, { data: groupsSummary })
  mock.onGet("/dashboard/leads-chart").reply((config) => {
    const year = Number(config.params?.year) || new Date().getFullYear()
    return [200, { data: leadsChart(year) }]
  })
  mock.onGet("/dashboard/attendance-chart").reply((config) => {
    const month = config.params?.month ?? "February 2024"
    return [200, { data: attendanceChartDash(month) }]
  })
  mock.onGet("/dashboard/income").reply((config) => {
    const month = config.params?.month ?? "December"
    return [200, incomeThisMonth(month)]
  })
  mock.onGet("/dashboard/enroll-chart").reply(200, { chart: enrollChart(), data: enrollList })
  mock.onGet("/dashboard/employed-graduates").reply((config) => {
    const limit = Number(config.params?.limit) || employedGraduates.length
    return [200, { data: employedGraduates.slice(0, limit), meta: { total: 215 } }]
  })
  mock.onGet("/dashboard/left-courses").reply(200, { data: leftCourses() })
  mock.onGet("/notifications").reply(200, { data: appNotifications })

  mock.onAny().passThrough()
}
