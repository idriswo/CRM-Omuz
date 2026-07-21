import { cn } from "@/lib/utils"
import type { EmployeeRole, MentorLevel } from "./mock-data"

const roleStyles: Record<EmployeeRole, string> = {
  Admin: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300",
  Manager: "bg-orange-100 text-orange-500 dark:bg-orange-500/15 dark:text-orange-300",
  Developer: "bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-300",
  Mentor: "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-300",
}

export function RoleBadge({ role }: { role: EmployeeRole }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold",
        roleStyles[role]
      )}
    >
      {role}
    </span>
  )
}

// Level → text color (used in the mentor-levels matrix)
export function levelColor(level: MentorLevel): string {
  if (level === "Intern") return "text-green-600 dark:text-green-400"
  if (level.startsWith("Junior")) return "text-indigo-600 dark:text-indigo-300"
  if (level.startsWith("Middle")) return "text-orange-500 dark:text-orange-300"
  return "text-violet-600 dark:text-violet-300" // Senior
}
