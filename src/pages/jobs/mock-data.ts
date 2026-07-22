// Static mock data — design only. Backend wiring comes later.

export type JobType = "Full-time" | "Part-time" | "Remote" | "Internship"
export type JobStatus = "Open" | "Closed"

export interface Job {
  id: number
  title: string
  company: string
  type: JobType
  location: string
  salaryMin: number
  salaryMax: number
  applicants: number
  postedDaysAgo: number
  status: JobStatus
}

export const jobTypes: JobType[] = ["Full-time", "Part-time", "Remote", "Internship"]
export const jobStatuses: JobStatus[] = ["Open", "Closed"]

export const jobs: Job[] = [
  { id: 1, title: "Frontend Developer", company: "Softclub", type: "Full-time", location: "Dushanbe", salaryMin: 1200, salaryMax: 1800, applicants: 14, postedDaysAgo: 2, status: "Open" },
  { id: 2, title: "React Developer", company: "Alif bank", type: "Full-time", location: "Dushanbe", salaryMin: 1500, salaryMax: 2200, applicants: 21, postedDaysAgo: 5, status: "Open" },
  { id: 3, title: "HTML & CSS Junior", company: "Humo", type: "Internship", location: "Remote", salaryMin: 400, salaryMax: 600, applicants: 32, postedDaysAgo: 1, status: "Open" },
  { id: 4, title: "UX/UI Designer", company: "Megafon", type: "Remote", location: "Remote", salaryMin: 900, salaryMax: 1400, applicants: 9, postedDaysAgo: 8, status: "Open" },
  { id: 5, title: "Graphic Designer", company: "VatanICT", type: "Part-time", location: "Khujand", salaryMin: 600, salaryMax: 900, applicants: 6, postedDaysAgo: 12, status: "Closed" },
  { id: 6, title: "C# (.NET) Developer", company: "Alif bank", type: "Full-time", location: "Dushanbe", salaryMin: 1600, salaryMax: 2400, applicants: 17, postedDaysAgo: 3, status: "Open" },
  { id: 7, title: "Python Backend Developer", company: "Humo", type: "Full-time", location: "Dushanbe", salaryMin: 1400, salaryMax: 2000, applicants: 11, postedDaysAgo: 6, status: "Open" },
  { id: 8, title: "QA Engineer", company: "Softclub", type: "Part-time", location: "Remote", salaryMin: 700, salaryMax: 1100, applicants: 4, postedDaysAgo: 20, status: "Closed" },
  { id: 9, title: "JavaScript Developer", company: "VatanICT", type: "Full-time", location: "Dushanbe", salaryMin: 1300, salaryMax: 1900, applicants: 25, postedDaysAgo: 4, status: "Open" },
]

export const companyColors: Record<string, string> = {
  Softclub: "#4c3ce8",
  "Alif bank": "#22c55e",
  Humo: "#f59e0b",
  Megafon: "#22b8cf",
  VatanICT: "#f5222d",
}
