import { api } from "@/store/api"

export interface SmsTemplate {
  id: number
  title: string
  description: string
}

export interface SmsHistoryItem {
  id: number
  title: string
  sent_at: string
  description: string
  groups: { name: string; period: string; members: string }[]
}

export interface SmsGroupStudent {
  id: number
  full_name: string
  email: string
}

export interface SmsGroup {
  id: number
  title: string
  period: string
  studentsTotal: number
  present: number
  students: SmsGroupStudent[]
}

export interface SmsPerson {
  id: number
  full_name: string
  email: string
  age: number
  course: string
  fatherPhone?: string
  motherPhone?: string
  level?: string
  tag?: string
  tagVariant?: "success" | "secondary" | "outline"
  bank?: string
}

/** "leads" was dropped — leads have no email address to send to. */
export type SmsRecipientType = "group" | "students" | "mentors" | "graduates"

export const smsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getSmsTemplates: build.query<{ data: SmsTemplate[] }, void>({
      query: () => ({ url: "/email/templates" }),
      providesTags: ["SmsTemplates"],
    }),
    createSmsTemplate: build.mutation<SmsTemplate, { title: string; description: string }>({
      query: (data) => ({ url: "/email/templates", method: "post", data }),
      invalidatesTags: ["SmsTemplates"],
    }),
    updateSmsTemplate: build.mutation<SmsTemplate, { id: number; data: Partial<SmsTemplate> }>({
      query: ({ id, data }) => ({ url: `/email/templates/${id}`, method: "put", data }),
      invalidatesTags: ["SmsTemplates"],
    }),
    deleteSmsTemplate: build.mutation<{ success: boolean }, number>({
      query: (id) => ({ url: `/email/templates/${id}`, method: "delete" }),
      invalidatesTags: ["SmsTemplates"],
    }),

    getSmsGroups: build.query<{ data: SmsGroup[] }, void>({
      query: () => ({ url: "/email/recipients/group" }),
    }),
    getSmsRecipients: build.query<{ data: SmsPerson[] }, { type: Exclude<SmsRecipientType, "group">; search?: string }>({
      query: ({ type, search }) => ({ url: `/email/recipients/${type}`, params: { search } }),
    }),

    sendSms: build.mutation<
      { success: boolean; sent_count: number; failed_count: number; recipients_count: number; mail_enabled: boolean },
      { recipient_type: "Student" | "Employee" | "Graduate"; recipient_ids: number[]; template_id?: number; subject?: string; text?: string }
    >({
      query: (data) => ({ url: "/email/send", method: "post", data }),
      invalidatesTags: [],
    }),
    getSmsHistory: build.query<{ data: SmsHistoryItem[] }, { search?: string } | void>({
      query: (params) => ({ url: "/email/history", params: params ?? {} }),
    }),
  }),
})

export const {
  useGetSmsTemplatesQuery,
  useCreateSmsTemplateMutation,
  useUpdateSmsTemplateMutation,
  useDeleteSmsTemplateMutation,
  useGetSmsGroupsQuery,
  useGetSmsRecipientsQuery,
  useSendSmsMutation,
  useGetSmsHistoryQuery,
} = smsApi
