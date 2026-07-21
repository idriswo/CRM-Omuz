// Static mock data — design only.

export type EventColor = "teal" | "yellow" | "orange" | "blue" | "purple" | "green"

export interface TimetableEvent {
  id: number
  title: string
  type: string // e.g. "Lecture"
  start: string // "16:00"
  end: string // "18:00"
  startHour: number // numeric start for positioning
  room: string
  mentor: string
  color: EventColor
}

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

export const dayEvents: TimetableEvent[] = [
  { id: 1, title: "Scratch", type: "Lecture", start: "10:00", end: "11:30", startHour: 10, room: "Class 2", mentor: "Zohira F", color: "teal" },

  { id: 2, title: "React Feb", type: "Lecture", start: "16:00", end: "18:00", startHour: 16, room: "Class 6", mentor: "Najibullo S", color: "teal" },
  { id: 3, title: "JS Level 1 Feb", type: "Lecture", start: "16:00", end: "18:00", startHour: 16, room: "Class 4", mentor: "Mr. Muhammadsaeed", color: "yellow" },
  { id: 4, title: "HTML 1 Feb Level 1", type: "Lecture", start: "16:00", end: "18:00", startHour: 16, room: "Class 3", mentor: "Mehriddin S", color: "orange" },
  { id: 5, title: "HTML 2 Feb", type: "Lecture", start: "16:00", end: "18:00", startHour: 16, room: "Meeting room", mentor: "Fariddun D", color: "orange" },
  { id: 6, title: "C++ Feb Level 1", type: "Lecture", start: "16:00", end: "18:00", startHour: 16, room: "Class 1", mentor: "Zohira F", color: "blue" },
  { id: 7, title: "C++ 2 Feb", type: "Lecture", start: "16:00", end: "18:00", startHour: 16, room: "Class 2", mentor: "Mr. Kurbonali", color: "blue" },
  { id: 8, title: "Olympiad 2", type: "Lecture", start: "16:00", end: "18:00", startHour: 16, room: "Teacher's room", mentor: "Omina K", color: "purple" },

  { id: 9, title: "React Jan", type: "Lecture", start: "18:00", end: "20:00", startHour: 18, room: "Class 6", mentor: "Najibullo S", color: "teal" },
  { id: 10, title: "JS Pro Feb", type: "Lecture", start: "18:00", end: "20:00", startHour: 18, room: "Class 3", mentor: "Mr. Hasan", color: "yellow" },
  { id: 11, title: "HTML 3 Feb", type: "Lecture", start: "18:00", end: "20:00", startHour: 18, room: "Class 8", mentor: "Mehriddin S", color: "orange" },
  { id: 12, title: "C# Feb", type: "Lecture", start: "18:00", end: "20:00", startHour: 18, room: "Meeting room", mentor: "Alijon", color: "purple" },
  { id: 13, title: "C++ Feb Level 1", type: "Lecture", start: "18:00", end: "20:00", startHour: 18, room: "Class 2", mentor: "Muhammad", color: "blue" },
  { id: 14, title: ".Net Feb", type: "Lecture", start: "18:00", end: "20:00", startHour: 18, room: "Teacher's room", mentor: "Olim", color: "purple" },
  { id: 15, title: "Olympiad 1", type: "Lecture", start: "18:00", end: "20:00", startHour: 18, room: "Class 1", mentor: "Mr. Sino", color: "green" },
  { id: 16, title: "Python Jan", type: "Lecture", start: "18:00", end: "20:00", startHour: 18, room: "Class 4", mentor: "Mr. Odina", color: "teal" },
]

export const hours = Array.from({ length: 13 }, (_, i) => 8 + i) // 08:00 - 20:00

export const weekDays = [
  { label: "Mon 19/03", short: "Mon" },
  { label: "Tue 20/03", short: "Tue" },
  { label: "Wed 21/03", short: "Wed" },
  { label: "Thu 22/03", short: "Thu" },
  { label: "Fri 23/03", short: "Fri" },
  { label: "Sat 24/03", short: "Sat" },
  { label: "Sun 25/03", short: "Sun" },
]

// ---- Month view ----

export interface MonthCell {
  day: number | null
  muted?: boolean // days belonging to prev/next month
  today?: boolean
  hasEvents?: boolean
}

const chipEvents = [
  { time: "10:00", title: "Scratch", color: "teal" as EventColor },
  { time: "16:00", title: "React Feb", color: "blue" as EventColor },
]
export const monthChipEvents = chipEvents
export const monthExtraCount = 16

// Feb 2023 grid (Mon-first). 29/30 muted from Jan, 1..28, then a couple trailing.
export const monthCells: MonthCell[] = [
  { day: 29, muted: true }, { day: 30, muted: true }, { day: 1 }, { day: 2 }, { day: 3, hasEvents: true }, { day: 4 }, { day: 5 },
  { day: 6 }, { day: 7, hasEvents: true }, { day: 8, hasEvents: true }, { day: 9 }, { day: 10 }, { day: 11 }, { day: 12 },
  { day: 13 }, { day: 14, hasEvents: true }, { day: 15, today: true, hasEvents: true }, { day: 16 }, { day: 17 }, { day: 18 }, { day: 19 },
  { day: 20 }, { day: 21 }, { day: 22, hasEvents: true }, { day: 23 }, { day: 24 }, { day: 25, hasEvents: true }, { day: 26, hasEvents: true },
  { day: 27 }, { day: 28, hasEvents: true }, { day: 29, hasEvents: true }, { day: 30 }, { day: 31, hasEvents: true }, { day: 1, muted: true }, { day: 2, muted: true },
]

export const monthWeekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
