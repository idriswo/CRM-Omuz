/** `position` and `mentor_level.level` are free text on the backend, so both
 * helpers degrade gracefully for values we have not seen before. */

export function positionLabel(position: string) {
  if (!position) return "—"
  return position.charAt(0).toUpperCase() + position.slice(1).toLowerCase()
}

export const positionStyles: Record<string, string> = {
  admin: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300",
  superadmin: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300",
  director: "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300",
  manager: "bg-orange-100 text-orange-500 dark:bg-orange-500/15 dark:text-orange-300",
  developer: "bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-300",
  mentor: "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-300",
  accountant: "bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300",
}

export function levelColor(level: string): string {
  const value = level.toLowerCase()
  if (value.startsWith("intern")) return "text-green-600 dark:text-green-400"
  if (value.startsWith("junior")) return "text-indigo-600 dark:text-indigo-300"
  if (value.startsWith("middle")) return "text-orange-500 dark:text-orange-300"
  if (value.startsWith("senior")) return "text-violet-600 dark:text-violet-300"
  return "text-foreground"
}
