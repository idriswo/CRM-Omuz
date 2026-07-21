import { Outlet } from "react-router-dom"

import { Logo } from "@/components/logo"
import { LanguageSwitcher } from "@/components/language-switcher"
import { WelcomeIllustration } from "@/components/welcome-illustration"

export function AuthLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="flex min-h-0 w-full flex-col gap-10 p-4 md:flex-row md:gap-0 md:p-6">
        <div className="flex min-h-0 w-full flex-col md:w-1/2">
          <div className="flex items-center justify-between">
            <Logo />
            <LanguageSwitcher />
          </div>

          <div className="flex flex-1 items-center justify-center overflow-y-auto py-10">
            <Outlet />
          </div>
        </div>

        <WelcomeIllustration className="hidden overflow-hidden rounded-2xl md:block md:w-1/2" />
      </div>
    </div>
  )
}
