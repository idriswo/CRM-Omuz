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
import { PerformancePage } from "@/pages/profile/performance-page"
import { StudentsPage } from "@/pages/students/students-page"
import { LeadersPage } from "@/pages/students/leaders-page"
import { StudentActivityPage } from "@/pages/students/student-activity-page"
import { ContractPage } from "@/pages/students/contract-page"
import { StudentFormPage } from "@/pages/students/student-form-page"
import { GraduatesPage } from "@/pages/students/graduates-page"
import { LeftCoursesPage } from "@/pages/students/left-courses-page"
import { EnrollStudentsPage } from "@/pages/students/enroll-students-page"
import { GroupsPage } from "@/pages/groups/groups-page"
import { GroupDetailPage } from "@/pages/groups/group-detail-page"
import { JournalPage } from "@/pages/journal/journal-page"
import { PlaceholderPage } from "@/pages/placeholder-page"

const placeholders: [string, string][] = [
  ["/dashboard", "Dashboard"],
  ["/employees", "Employees"],
  ["/progressbook", "Progressbook"],
  ["/timetable", "Timetable"],
  ["/courses", "Courses"],
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
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/students/new" element={<StudentFormPage />} />
          <Route path="/students/graduates" element={<GraduatesPage />} />
          <Route path="/students/left-courses" element={<LeftCoursesPage />} />
          <Route path="/students/enroll" element={<EnrollStudentsPage />} />
          <Route path="/students/leaders" element={<LeadersPage />} />
          <Route path="/students/activity" element={<StudentActivityPage />} />
          <Route path="/students/:id/edit" element={<StudentFormPage />} />
          <Route path="/students/:id/contract" element={<ContractPage />} />
          <Route path="/profile/performance" element={<PerformancePage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/groups/:id" element={<GroupDetailPage />} />
          <Route path="/groups/:id/journal" element={<JournalPage />} />
          <Route path="/administration/users" element={<UsersPage />} />
          <Route path="/administration/permissions" element={<PermissionsPage />} />
          <Route path="/administration/logs" element={<LogsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
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
