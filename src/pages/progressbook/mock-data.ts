// Static mock data — design only. Backend wiring comes later.

export interface ProgressRow {
  id: number
  fullName: string
  photo?: string
  group: string
  course: string
  mentor: string
  attendance: number // 0-100
  averageScore: number // 0-100
  trend: "up" | "down" | "flat"
}

export const courses = ["JavaScript", "C#", "React", "C++", "Python", "UX/UI design"] as const
export const groups = [
  "C++ May",
  "C# 2 August",
  "React",
  "Olympiad 4",
  "HTML June",
  "JavaScript June #2",
] as const

export const progressRows: ProgressRow[] = [
  { id: 1, fullName: "Tojiev Olimjon", group: "HTML June", course: "JavaScript", mentor: "Shamsuddinov N", attendance: 92, averageScore: 88, trend: "up" },
  { id: 2, fullName: "Ahmad Abdulsamad", group: "C# 2 August", course: "C#", mentor: "Nurullo Sulaymonov", attendance: 78, averageScore: 74, trend: "up" },
  { id: 3, fullName: "Najibullo Shamsuddinov", group: "Olympiad 4", course: "Python", mentor: "Alijon Zabiri", attendance: 65, averageScore: 58, trend: "down" },
  { id: 4, fullName: "Alijon Zabiri", group: "HTML June", course: "JavaScript", mentor: "Shamsuddinov N", attendance: 97, averageScore: 95, trend: "up" },
  { id: 5, fullName: "Shodmon Inoyatzoda", group: "C++ May", course: "C++", mentor: "Nurullo Sulaymonov", attendance: 54, averageScore: 49, trend: "down" },
  { id: 6, fullName: "Nazarov Qurbonali", group: "React", course: "React", mentor: "Alijon Zabiri", attendance: 88, averageScore: 82, trend: "flat" },
  { id: 7, fullName: "Alij Rasulov", group: "HTML June", course: "JavaScript", mentor: "Shamsuddinov N", attendance: 71, averageScore: 68, trend: "up" },
  { id: 8, fullName: "Muhammadjon Mirzoev", group: "C# 2 August", course: "UX/UI design", mentor: "Nurullo Sulaymonov", attendance: 83, averageScore: 79, trend: "flat" },
  { id: 9, fullName: "Sitora Karimova", group: "React", course: "React", mentor: "Alijon Zabiri", attendance: 95, averageScore: 91, trend: "up" },
  { id: 10, fullName: "Faridun Dodarov", group: "Olympiad 4", course: "Python", mentor: "Alijon Zabiri", attendance: 60, averageScore: 55, trend: "down" },
  { id: 11, fullName: "Manuchehr Rahimov", group: "C++ May", course: "C++", mentor: "Nurullo Sulaymonov", attendance: 76, averageScore: 71, trend: "flat" },
  { id: 12, fullName: "Dilovar Karimov", group: "React", course: "React", mentor: "Alijon Zabiri", attendance: 89, averageScore: 85, trend: "up" },
]
