// Static mock data — design only.

export interface Course {
  id: number
  title: string
  groups: number
  fee: number
  duration: string
}

export const courses: Course[] = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  title: "JavaScript",
  groups: 12,
  fee: 1000,
  duration: "3 month",
}))

// ---- Syllabus (Resources) ----

export type LessonType = "Lecture" | "Practice" | "Exam"

export interface Lesson {
  id: number
  title: string
  description: string
  types: LessonType[]
}

export const syllabus: Lesson[] = [
  { id: 1, title: "Day 1 (About JS)", description: "This is introduction lesson", types: ["Lecture", "Practice"] },
  { id: 2, title: "Day 1 (About JS)", description: "This is introduction lesson", types: ["Lecture", "Practice"] },
  {
    id: 3,
    title: "Day 1 (About JS)",
    description: "This is introduction lesson (variable, data types, operation, loops, conditions, functions and more)",
    types: ["Exam"],
  },
]

// ---- Leads / Clients ----

export type LeadType = "Lead" | "Client"

export interface Lead {
  id: number
  fullName: string
  phone: string
  lessonTime: string
  course: string
  utmSource: string
  occupation: string
  register: string
  notes: string
  type: LeadType
}

const occupations = ["Pupil", "Employee", "Graduate", "Student"]
const registerMonths = ["January", "January", "March", "March", "March", "March", "March", "April", "April", "April"]
const leadTypes: LeadType[] = ["Lead", "Lead", "Client", "Lead", "Client", "Client", "Lead", "Client", "Lead", "Lead"]

export const leads: Lead[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  fullName: "Ahmad Abdulsamad",
  phone: "93 258 4147",
  lessonTime: "16:00",
  course: i === 3 || i === 5 ? "----" : "JavaScript",
  utmSource: "Instagram",
  occupation: occupations[i % occupations.length],
  register: registerMonths[i],
  notes: i === 3 ? "UX/UI design course" : i === 5 ? "Cuorse Python" : "----",
  type: leadTypes[i],
}))

export const leadCourses = ["JavaScript", "React", "Python", "C++"]

// ---- Coupons ----

export interface Coupon {
  id: number
  course: string
  price: number
  from: string
  to: string
  active: boolean
  logo: "cpp" | "htmlcss" | "js" | "react"
}

export const coupons: Coupon[] = [
  { id: 1, course: "C++", price: 250, from: "Apr 9, 2023", to: "Aug 10, 2023", active: true, logo: "cpp" },
  { id: 2, course: "Html & Css", price: 160, from: "Apr 9, 2023", to: "Aug 10, 2023", active: true, logo: "htmlcss" },
  { id: 3, course: "JavaScript", price: 580, from: "Apr 9, 2023", to: "Aug 10, 2023", active: true, logo: "js" },
  { id: 4, course: "React", price: 600, from: "Apr 9, 2023", to: "Aug 10, 2023", active: false, logo: "react" },
]
