import { Outlet } from "react-router-dom"

import { Logo } from "@/components/logo"
import { LanguageSwitcher } from "@/components/language-switcher"
import authIllustration from "@/assets/brand/auth-illustration.png"

export function AuthLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="flex min-h-0 w-full flex-col gap-10 p-4 md:flex-row md:gap-0 md:p-6">
        <div className="flex w-full flex-col md:w-1/2 ">
          <div className="flex items-center justify-between">
            <Logo />
            <LanguageSwitcher />
          </div>

          <div className="flex flex-1 items-center justify-center py-10">
            <Outlet />
          </div>
        </div>

        <div className="hidden overflow-hidden rounded-2xl md:flex md:w-1/2">
          <img
            src={authIllustration}
            alt="Welcome to ômuz"
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>
      </div>
    </div>
  )
}
