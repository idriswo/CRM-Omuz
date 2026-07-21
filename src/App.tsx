import { Navigate, Route, Routes } from "react-router-dom"

import { ThemeProvider } from "@/components/theme-provider"
import { AuthLayout } from "@/components/layout/auth-layout"
import { MainLayout } from "@/components/layout/main-layout"
import { LoginPage } from "@/pages/auth/login-page"
import { BranchesPage } from "@/pages/branches/branches-page"
import { UsersPage } from "@/pages/administration/users-page"
import { PermissionsPage } from "@/pages/administration/permissions-page"
import { LogsPage } from "@/pages/administration/logs-page"
import { ProfilePage } from "@/pages/profile/profile-page"
import { EmployeesPage } from "@/pages/employees/employees-page"
import { AddEmployeePage } from "@/pages/employees/add-employee-page"
import { MentorLevelsPage } from "@/pages/employees/mentor-levels-page"
import { CoursesPage } from "@/pages/courses/courses-page"
import { CourseSyllabusPage } from "@/pages/courses/course-syllabus-page"
import { LeadsPage } from "@/pages/courses/leads-page"
import { CouponsPage } from "@/pages/courses/coupons-page"
import { TimetablePage } from "@/pages/timetable/timetable-page"
import { PlaceholderPage } from "@/pages/placeholder-page"
import { AccountingOverviewPage } from "@/pages/accounting/accounting-overview-page"
import { PaymentsPage } from "@/pages/accounting/payments-page"
import { BudgetPage } from "@/pages/accounting/budget-page"
import { SalaryPage } from "@/pages/accounting/salary-page"
import { AvansPage } from "@/pages/accounting/avans-page"
import { DebtorsPage } from "@/pages/accounting/debtors-page"
import { ExpensesPage } from "@/pages/accounting/expenses-page"
import { AccountantPage } from "@/pages/accounting/accountant-page"
import { NetPage } from "@/pages/accounting/net-page"
import { SmsMailingsPage } from "@/pages/sms/sms-mailings-page"
import { DashboardPage } from "@/pages/dashboard/dashboard-page"

const placeholders: [string, string][] = [
  ["/students", "Students"],
  ["/groups", "Groups"],
  ["/progressbook", "Progressbook"],
  ["/jobs", "Jobs"],
]

const App = () => {
  return (
    <ThemeProvider>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/branches" element={<BranchesPage />} />
          <Route path="/administration/users" element={<UsersPage />} />
          <Route path="/administration/permissions" element={<PermissionsPage />} />
          <Route path="/administration/logs" element={<LogsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/accounting" element={<AccountingOverviewPage />} />
          <Route path="/accounting/payments" element={<PaymentsPage />} />
          <Route path="/accounting/budget" element={<BudgetPage />} />
          <Route path="/accounting/salary" element={<SalaryPage />} />
          <Route path="/accounting/avans" element={<AvansPage />} />
          <Route path="/accounting/debtors" element={<DebtorsPage />} />
          <Route path="/accounting/expenses" element={<ExpensesPage />} />
          <Route path="/accounting/accountant" element={<AccountantPage />} />
          <Route path="/accounting/net" element={<NetPage />} />
          <Route path="/sms-mailings" element={<SmsMailingsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/employees/new" element={<AddEmployeePage />} />
          <Route path="/employees/mentor-levels" element={<MentorLevelsPage />} />

          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id/syllabus" element={<CourseSyllabusPage />} />
          <Route path="/courses/leads" element={<LeadsPage />} />
          <Route path="/courses/coupons" element={<CouponsPage />} />

          <Route path="/timetable" element={<TimetablePage />} />
          {placeholders.map(([path, title]) => (
            <Route key={path} path={path} element={<PlaceholderPage title={title} />} />
          ))}
        </Route>

        <Route path="/" element={<Navigate to="/branches" replace />} />
        <Route path="*" element={<Navigate to="/branches" replace />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
