import { Outlet, useLocation } from "react-router-dom"

import { ErrorBoundary } from "@/components/error-boundary"
import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"

export function MainLayout() {
  const { pathname } = useLocation()

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <ErrorBoundary resetKey={pathname}>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
