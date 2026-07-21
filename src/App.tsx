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

const placeholders: [string, string][] = [
  ["/dashboard", "Dashboard"],
  ["/students", "Students"],
  ["/groups", "Groups"],
  ["/progressbook", "Progressbook"],
  ["/accounting", "Accounting"],
  ["/jobs", "Jobs"],
  ["/sms-mailings", "SMS mailings"],
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
