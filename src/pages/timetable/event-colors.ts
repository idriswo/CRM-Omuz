export type EventColor = "teal" | "yellow" | "orange" | "blue" | "purple" | "green"

export const eventColors: Record<
  EventColor,
  { border: string; bg: string; chip: string; dot: string }
> = {
  teal: {
    border: "border-l-teal-400",
    bg: "bg-teal-50 dark:bg-teal-500/10",
    chip: "border-teal-300 text-teal-600 dark:text-teal-300",
    dot: "bg-teal-400",
  },
  yellow: {
    border: "border-l-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-500/10",
    chip: "border-yellow-300 text-yellow-600 dark:text-yellow-300",
    dot: "bg-yellow-400",
  },
  orange: {
    border: "border-l-orange-400",
    bg: "bg-orange-50 dark:bg-orange-500/10",
    chip: "border-orange-300 text-orange-500 dark:text-orange-300",
    dot: "bg-orange-400",
  },
  blue: {
    border: "border-l-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    chip: "border-blue-300 text-blue-600 dark:text-blue-300",
    dot: "bg-blue-400",
  },
  purple: {
    border: "border-l-purple-400",
    bg: "bg-purple-50 dark:bg-purple-500/10",
    chip: "border-purple-300 text-purple-600 dark:text-purple-300",
    dot: "bg-purple-400",
  },
  green: {
    border: "border-l-green-400",
    bg: "bg-green-50 dark:bg-green-500/10",
    chip: "border-green-300 text-green-600 dark:text-green-300",
    dot: "bg-green-400",
  },
}

const ORDER: EventColor[] = ["teal", "yellow", "orange", "blue", "purple", "green"]

/** The API has no colour field, so a lesson's colour is derived from its course
 * name — same course, same colour, every render. */
export function colorForCourse(name: string): EventColor {
  let total = 0
  for (const char of name) total = (total * 31 + char.charCodeAt(0)) >>> 0
  return ORDER[total % ORDER.length]
}
