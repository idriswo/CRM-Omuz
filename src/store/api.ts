import { createApi } from "@reduxjs/toolkit/query/react"

import { axiosBaseQuery } from "./axiosBaseQuery"

export const api = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    "Users",
    "Permissions",
    "Roles",
    "Logs",
    "Branches",
    "Profile",
    "Students",
    "Graduates",
    "LeftCourses",
    "Groups",
    "Journal",
    "Schedule",
  ],
  endpoints: () => ({}),
})
