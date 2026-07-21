import type {
  ActivityCategory,
  ActivityRow,
  Graduate,
  GraduateTag,
  GroupedRow,
  Leader,
  LeftCourseRow,
  Student,
  Winner,
} from "@/store/services/students"
import type {
  GroupDetail,
  GroupTagStat,
  GroupStatus,
  ScheduleSlot,
  Weekday,
} from "@/store/services/groups"
import type { Performance } from "@/store/services/profile"
import type { Journal, JournalWeek } from "@/store/services/journal"

/** Deterministic pseudo-random so the mocked screens look stable between reloads. */
function seeded(seed: number) {
  let value = seed >>> 0
  return () => {
    value = (value + 0x6d2b79f5) >>> 0
    let t = value
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const studentNames = [
  "Tojiev Olimjon",
  "Ahmad Abdulsamad",
  "Alijon Zabiri",
  "Nazarov Qurbonali",
  "Najibullo Shamsuddinov",
  "Faridun Dodarov",
  "Shodmon Inoyatzoda",
  "Muhammadjon Mirzoev",
  "Sitora Karimova",
  "Manuchehr Rahimov",
  "Dilovar Karimov",
  "Hojiabdurahim S",
]

const courseNames = ["JavaScript", "C#", "React", "C++", "Python", "UX/UI design"]
const groupNames = [
  "C# 5 June",
  "React May",
  "C++ June",
  "JavaScript August",
  "Olympiad 1",
  "Olympiad 2",
  "React - 4",
  "React - 6",
  "C# 1",
  "C# April",
]
const branchNames = ["Sadbarg", "Profsous"]
const mentorNames = ["Shamsuddinov N", "Nurullo Sulaymonov", "Alijon Zabiri"]

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

// --- Students ---

const rndStudent = seeded(7)

export const students: Student[] = Array.from({ length: 48 }, (_, i) => {
  const name = studentNames[i % studentNames.length]
  const [last, first] = name.split(" ")
  const r = rndStudent()
  return {
    id: i + 1,
    full_name: name,
    first_name: first ?? name,
    last_name: last,
    birth_date: "1995-08-23",
    age: 18 + (i % 12),
    gender: i % 3 === 2 ? "female" : "male",
    address: "Dushanbe, Ayni street 46",
    email: "student@omuz.tj",
    phone: "93 258 4147",
    father_phone: "93 435 4943",
    phones: [
      { label: "Student", number: "93 435 4943" },
      { label: "Father", number: "93 435 4943" },
    ],
    groups: [
      {
        id: (i % groupNames.length) + 1,
        name: groupNames[i % groupNames.length],
        period: "Apr 9, 2023 - Aug 10, 2023",
      },
    ],
    status: i % 11 === 4 ? "finished" : i % 7 === 3 ? "inactive" : "active",
    has_account: r > 0.6,
    contract_status: i % 9 === 1 ? "10_day_left" : i % 13 === 4 ? "finished" : "active",
    is_top: i % 8 === 1,
    branch_id: (i % 2) + 1,
    telegram_username: "@omuz_student",
    description: "",
    photo: null,
  }
})

// --- Graduates ---

const graduateTags: GraduateTag[] = [
  "OpenToWork",
  "Work",
  "Freelancer",
  "OpenToWork",
  "Entrepreneur",
  "OpenToWork",
  "Work",
  "FurtherEducation",
]

const workPlaces = ["Search", "Alif bank", "Softclub", "VatanICT", "Search"]

export const graduates: Graduate[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  full_name: studentNames[i % studentNames.length],
  age: 18 + (i % 8),
  group: "JavaScrip June #2",
  date_of_issue: "08.08.2024",
  work_place: workPlaces[i % workPlaces.length],
  serial: `#Ud2024 0${(i % 9) + 1}`,
  has_certificate: i % 3 !== 0,
  tag: graduateTags[i % graduateTags.length],
  photo: null,
}))

export const graduatesStats = {
  graduates: 88,
  employed: 40,
  open_to_work: 20,
  freelancer: 10,
  further_edu: 18,
}

// --- Left courses / Enrolled ---

const leftReasons = ["Дар дарсхо иштирок накард", "Компютераш вайрон шуд"]

export const leftCourses: LeftCourseRow[] = Array.from({ length: 26 }, (_, i) => ({
  id: i + 1,
  full_name: studentNames[i % studentNames.length],
  group: groupNames[i % 4],
  mentor: mentorNames[i % mentorNames.length],
  phone: "93 258 4147",
  date: "June 9, 2023",
  reason: leftReasons[i % leftReasons.length],
}))

export const enrolled: LeftCourseRow[] = Array.from({ length: 26 }, (_, i) => ({
  id: i + 1,
  full_name: studentNames[i % studentNames.length],
  group: groupNames[i % 4],
  mentor: mentorNames[i % mentorNames.length],
  phone: "93 258 4147",
  date: "June 9, 2023",
  reason: "",
}))

export const monthlyChart = (seed: number) => {
  const rnd = seeded(seed)
  return months.map((month, i) => ({
    month,
    value: Math.round(12 + 20 * Math.sin(i / 1.7) + rnd() * 14),
  }))
}

// --- Groups ---

const statuses: GroupStatus[] = ["Started", "Started", "Pending", "Started", "Finished"]

export const groups: GroupDetail[] = Array.from({ length: 24 }, (_, i) => {
  const capacity = 15
  const required = 7 + (i % 6)
  return {
    id: i + 1,
    name: groupNames[i % groupNames.length],
    course: courseNames[i % courseNames.length],
    start_date: "Apr 9, 2023",
    end_date: "Aug 10, 2023",
    duration: i % 3 === 0 ? "3 month" : i % 3 === 1 ? "1 year" : "1 month",
    required_students: required,
    passing_students: 4 + (i % 5),
    capacity,
    days: "Mn, Tu, Wd, Th, Fr, Sa",
    time: "16:00 - 18:00",
    branch: branchNames[i % branchNames.length],
    status: statuses[i % statuses.length],
    mentors: [mentorNames[i % mentorNames.length], mentorNames[(i + 1) % mentorNames.length]],
    students: students.slice(i % 6, (i % 6) + 8).map((s) => ({
      id: s.id,
      full_name: s.full_name,
      phone: s.phone,
      father_phone: s.father_phone,
      has_account: true,
      status: "Active" as const,
    })),
    left_course: [
      {
        id: 1,
        full_name: "Dilovar Karimov",
        phone: "93 800 22 74",
        has_account: false,
        reason: leftReasons[0],
      },
      {
        id: 2,
        full_name: "Dilovar Karimov",
        phone: "93 800 22 74",
        has_account: false,
        reason: leftReasons[1],
      },
    ],
  }
})

export const groupStats: GroupTagStat[] = [
  { label: "Black list", count: 24, color: "#f5222d" },
  { label: "Kettle", count: 18, color: "#fa541c" },
  { label: "Advanced", count: 40, color: "#f5c518" },
  { label: "Handsome", count: 10, color: "#22c55e" },
  { label: "ChatGPT", count: 20, color: "#22b8cf" },
]

// --- Journal ---

const rndJournal = seeded(23)

function buildWeek(weekNumber: number, roster: { id: number; full_name: string }[]): JournalWeek {
  const dates = Array.from({ length: 5 }, (_, d) => `0${d + 1}.11.22`)
  return {
    week_number: weekNumber,
    dates,
    students: roster.map((s) => ({
      student_id: s.id,
      full_name: s.full_name,
      days: dates.map((date) => ({
        date,
        attendance: rndJournal() > 0.4,
        score: 5,
        comment: "",
      })),
      bonus: 5,
      exam: 72,
      sum: 80,
    })),
  }
}

// --- Grouped views (the "Groups" tab on Graduates / Left courses) ---

const graduateGroupNames = ["C# 2 August", "React June #1", "C++ Online January", "JavaScript May"]

export const graduateGroups: GroupedRow<Graduate>[] = graduateGroupNames.map((name, i) => ({
  id: i + 1,
  name,
  students_count: 7,
  period: "Apr 9, 2023 - Aug 10, 2023",
  rows: graduates.slice(i * 4, i * 4 + 4).map((g) => ({ ...g, group: name })),
}))

export const leftCourseGroups: GroupedRow<LeftCourseRow>[] = graduateGroupNames.map((name, i) => ({
  id: i + 1,
  name,
  students_count: 7,
  period: "Apr 9, 2023 - Aug 10, 2023",
  rows: leftCourses.slice(i * 5, i * 5 + 5).map((l) => ({ ...l, group: name })),
}))

// --- Leaders ---

export const leaders: Leader[] = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  rank: i + 1,
  full_name: studentNames[i % studentNames.length],
  points: 96 - i,
  phone: "985415287",
  group: groupNames[i % groupNames.length],
  photo: null,
}))

export const winners: Winner[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  full_name: studentNames[(i + 3) % studentNames.length],
  age: 18 + (i % 6),
  points: 95 - i,
  group: courseNames[i % courseNames.length],
  date: "Jan 11, 2023",
  photo: null,
}))

// --- Student activity ---

const categories: ActivityCategory[] = ["Handsome", "Advanced", "Advanced", "Kettle", "Black list"]

const rndActivity = seeded(97)

export const studentActivity: ActivityRow[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  full_name: studentNames[i % studentNames.length],
  group: groupNames[i % groupNames.length],
  points: Math.round(40 + rndActivity() * 55),
  category: categories[i % categories.length],
  absence: Math.round(rndActivity() * 4),
}))

// --- Schedule ---

const weekdays: Weekday[] = ["Mn", "Tu", "Wd", "Th", "Fr", "Sa"]

export const schedules = new Map<number, ScheduleSlot[]>()

export function scheduleFor(groupId: number): ScheduleSlot[] {
  if (!schedules.has(groupId)) {
    schedules.set(
      groupId,
      weekdays.map((weekday, i) => ({ id: i + 1, weekday, start: "09:00", end: "12:00" }))
    )
  }
  return schedules.get(groupId)!
}

// --- Profile performance ---

const roadmapPalette = [
  { initials: "JS", color: "#f5c518" },
  { initials: "C++", color: "#4c8bf5" },
  { initials: "HC", color: "#fa541c" },
]

export const performance: Performance = {
  present_hours: 56,
  absent_hours: 4,
  late_minutes: 48,
  group: "JavaScript August",
  week: 4,
  days: ["Mn, Apr 9", "Tu, Apr 10", "Wd, Apr 11", "Th, Apr 12", "Fr, Apr 13", "Sn, Apr 14"].map(
    (label, i) => ({
      label,
      score: 3 + (i % 3),
      present: "1h 45min",
      late: "15min",
      comment: "I don't know. He not say why",
    })
  ),
  expense: months.map((month, i) => ({
    month,
    value: Math.round(10 + 18 * Math.sin(i / 1.6) + 14),
    present: "2h",
    late: "15min",
    comment: "I don't know. He not say why",
  })),
  roadmap: ["JavaScript August", "C++ #2 May", "HTML & CSS #2 April"].map((title, i) => ({
    id: i + 1,
    title,
    period: i === 0 ? "Aug 11, 2023 - Oct 10, 2023" : "May 9, 2023 - Aug 10, 2023",
    initials: roadmapPalette[i].initials,
    color: roadmapPalette[i].color,
    weeks: [80, 95, 85, 24, 85].slice(0, i === 1 ? 4 : 5).map((score, w) => ({
      week: w + 1,
      score,
    })),
    average: 95,
  })),
}

export function buildJournal(groupId: number): Journal {
  const group = groups.find((g) => g.id === groupId) ?? groups[0]
  const roster = group.students.map((s) => ({ id: s.id, full_name: s.full_name }))
  const weeks = [4, 3, 2, 1].map((n) => buildWeek(n, roster))
  const rnd = seeded(groupId * 31 + 5)

  // The trailing "Avarage" column is what the design shows after the last week.
  const chart = ["Week 1", "Week 2", "Week 3", "Week 4", "Avarage"].map((week) => {
    const point: Record<string, string | number> = { week }
    roster.slice(0, 6).forEach((s) => {
      point[s.full_name] = Math.round(35 + 55 * rnd())
    })
    return point as Journal["chart"][number]
  })

  return {
    group_id: group.id,
    group_name: group.name,
    weeks,
    chart,
    students: roster.slice(0, 6).map((s) => ({ id: s.id, name: s.full_name })),
  }
}
