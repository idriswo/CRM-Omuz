import { useNavigate } from "react-router-dom"
import { Moon, Search, Sun, UserCircle2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LanguageSwitcher } from "@/components/language-switcher"
import { NotificationDropdown } from "@/components/layout/notification-dropdown"
import { useLogoutMutation } from "@/store/services"
import { useTheme } from "@/components/use-theme"
import { clearSession, getRole, profileRouteForRole } from "@/lib/auth"

export function Topbar() {
  const { theme, toggleTheme } = useTheme()
  const [logout] = useLogoutMutation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    clearSession()
    navigate("/login")
  }

  return (
    <header className="flex h-[68px] items-center gap-4 border-b border-border bg-background px-6">
      <button className="rounded-md p-2 hover:bg-accent" aria-label="Toggle sidebar">
        <svg viewBox="0 0 20 20" fill="none" className="size-5 text-primary">
          <path d="M3 5h14M3 10h14M3 15h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>

      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search..." className="pl-10" />
      </div>

      <div className="ml-auto flex items-center gap-4">
        <LanguageSwitcher />

        <NotificationDropdown />

        <button
          className="rounded-md p-2 hover:bg-accent"
          aria-label="Toggle theme"
          onClick={toggleTheme}
        >
          {theme === "dark" ? (
            <Moon className="size-5 text-primary" />
          ) : (
            <Sun className="size-5 text-primary" />
          )}
        </button>

        <div className="h-6 w-px bg-border" />

        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-4 focus-visible:ring-ring">
            <UserCircle2 className="size-9 text-primary" strokeWidth={1.5} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => navigate(profileRouteForRole(getRole()))}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={handleLogout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
