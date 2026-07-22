import { Navigate, Route, Routes } from "react-router-dom"

import { ThemeProvider } from "@/components/theme-provider"
import { AuthLayout } from "@/components/layout/auth-layout"
import { MainLayout } from "@/components/layout/main-layout"
import { RequireRole } from "@/components/require-role"
import { getRole, homeRouteForRole, isAuthenticated } from "@/lib/auth"
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
import { StudentProfilePage } from "@/pages/student/profile-page"
import { StudentGroupmatesPage } from "@/pages/student/groupmates-page"
import { StudentScoresPage } from "@/pages/student/scores-page"
import { StudentCoinsPage } from "@/pages/student/coins-page"
import { ProgressbookPage } from "@/pages/progressbook/progressbook-page"
import { JobsPage } from "@/pages/jobs/jobs-page"

function RoleHome() {
  if (!isAuthenticated()) return <Navigate to="/login" replace />
  return <Navigate to={homeRouteForRole(getRole())} replace />
}

const App = () => {
  return (
    <ThemeProvider>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<MainLayout />}>
          {/* Staff: admin, superadmin, director */}
          <Route element={<RequireRole roles={["admin", "superadmin", "director"]} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
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
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/performance" element={<PerformancePage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/groups/:id" element={<GroupDetailPage />} />
            <Route path="/groups/:id/journal" element={<JournalPage />} />

            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/employees/new" element={<AddEmployeePage />} />
            <Route path="/employees/:id/edit" element={<AddEmployeePage />} />
            <Route path="/employees/mentor-levels" element={<MentorLevelsPage />} />

            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id/syllabus" element={<CourseSyllabusPage />} />
            <Route path="/courses/leads" element={<LeadsPage />} />
            <Route path="/courses/coupons" element={<CouponsPage />} />

            <Route path="/timetable" element={<TimetablePage />} />
            <Route path="/sms-mailings" element={<SmsMailingsPage />} />
            <Route path="/progressbook" element={<ProgressbookPage />} />
            <Route path="/jobs" element={<JobsPage />} />

            {/* Superadmin + director only */}
            <Route element={<RequireRole roles={["superadmin", "director"]} />}>
              <Route path="/administration/users" element={<UsersPage />} />
              <Route path="/administration/permissions" element={<PermissionsPage />} />
              <Route path="/administration/logs" element={<LogsPage />} />
            </Route>

            {/* Director only (Finance) */}
            <Route element={<RequireRole roles={["director"]} />}>
              <Route path="/accounting" element={<AccountingOverviewPage />} />
              <Route path="/accounting/payments" element={<PaymentsPage />} />
              <Route path="/accounting/budget" element={<BudgetPage />} />
              <Route path="/accounting/salary" element={<SalaryPage />} />
              <Route path="/accounting/avans" element={<AvansPage />} />
              <Route path="/accounting/debtors" element={<DebtorsPage />} />
              <Route path="/accounting/expenses" element={<ExpensesPage />} />
              <Route path="/accounting/accountant" element={<AccountantPage />} />
              <Route path="/accounting/net" element={<NetPage />} />
            </Route>
          </Route>

          {/* Student: read-only self-service */}
          <Route element={<RequireRole roles={["student"]} />}>
            <Route path="/student/profile" element={<StudentProfilePage />} />
            <Route path="/student/groupmates" element={<StudentGroupmatesPage />} />
            <Route path="/student/scores" element={<StudentScoresPage />} />
            <Route path="/student/coins" element={<StudentCoinsPage />} />
          </Route>
        </Route>

        <Route path="/" element={<RoleHome />} />
        <Route path="*" element={<RoleHome />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
