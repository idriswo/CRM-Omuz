import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"
import { getRole } from "@/lib/auth"
import { navItems, studentNavItems, type NavItem } from "./nav-config"

/** Longest matching child wins, so /students/graduates never lights up "All students". */
function activeChildPath(item: NavItem, pathname: string) {
  return (
    item.children
      ?.filter((child) => pathname === child.to || pathname.startsWith(`${child.to}/`))
      .sort((a, b) => b.to.length - a.to.length)[0]?.to ?? null
  )
}

function isChildActive(item: NavItem, pathname: string) {
  if (activeChildPath(item, pathname) !== null) return true
  return !!item.children && !!item.to && pathname.startsWith(item.to)
}

export function Sidebar() {
  const { pathname } = useLocation()
  const role = getRole()
  const items =
    role === "student" ? studentNavItems : navItems.filter((item) => !item.roles || item.roles.includes(role!))
  const [openGroups, setOpenGroups] = useState<string[]>(
    items.filter((item) => isChildActive(item, pathname)).map((item) => item.label)
  )

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    )
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-sidebar-border bg-sidebar px-4 py-6">
      <div className="mb-6 px-2">
        <Logo />
      </div>

      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const Icon = item.icon
          const open = openGroups.includes(item.label)
          const active = item.to
            ? pathname === item.to
            : isChildActive(item, pathname)

          if (!item.children) {
            return (
              <NavLink
                key={item.label}
                to={item.to!}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  active && "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                )}
              >
                <Icon className="size-[18px]" />
                {item.label}
              </NavLink>
            )
          }

          const parentActive = item.to ? pathname === item.to : false

          return (
            <div key={item.label}>
              <div
                className={cn(
                  "flex items-center rounded-lg transition-colors hover:bg-sidebar-accent",
                  parentActive && "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                )}
              >
                {item.to ? (
                  <NavLink
                    to={item.to}
                    className={cn(
                      "flex flex-1 items-center gap-3 px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 hover:text-sidebar-accent-foreground",
                      (active || parentActive) && "text-sidebar-accent-foreground font-semibold"
                    )}
                  >
                    <Icon className="size-[18px]" />
                    {item.label}
                  </NavLink>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleGroup(item.label)}
                    className={cn(
                      "flex flex-1 items-center gap-3 px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 hover:text-sidebar-accent-foreground",
                      active && "text-sidebar-accent-foreground font-semibold"
                    )}
                  >
                    <Icon className="size-[18px]" />
                    <span className="flex-1 text-left">{item.label}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => toggleGroup(item.label)}
                  aria-label={open ? "Collapse group" : "Expand group"}
                  className="rounded-lg py-2.5 pr-3 pl-1 text-sidebar-foreground/80 hover:text-sidebar-accent-foreground"
                >
                  <ChevronDown
                    className={cn("size-4 transition-transform", open && "rotate-180")}
                  />
                </button>
              </div>
              {open && (
                <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-sidebar-border pl-4">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      className={cn(
                        "rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        activeChildPath(item, pathname) === child.to &&
                          "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                      )}
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
