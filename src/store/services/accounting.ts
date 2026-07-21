import { api } from "@/store/api"
import type { Envelope } from "./types"

export interface Payment {
  id: number
  full_name: string
  phone: string
  amount: number
  discount: number
  paid: number
  date: string
  group: string
  branch: string
  status: "Active" | "Prepayment"
}

export interface BudgetItem {
  id: number
  category_name: string
  from_date: string
  to_date: string
  amount_allocated: number
  amount_spent: number
  status: "Active" | "Inactive"
}

export interface BudgetChartPoint {
  month: string
  amount_allocated: number
  amount_spent: number
}

export interface SalaryItem {
  id: number
  full_name: string
  total: number
  prepaid: number
  remaining: number
  paid: number
  month: string
  status: "Active" | "Inactive"
}

export interface AvansItem {
  id: number
  full_name: string
  month: string
  amount: number
  description: string
  status: "pending" | "approved" | "denied"
}

export interface DebtorItem {
  id: number
  full_name: string
  from_date: string
  to_date: string
  total_debt_amount: number
  payment_per_month: number
  total_paid_amount: number
  notes: string
  status: "Inprogress" | "Paid"
}

export interface ExpenseSubItem {
  id: number
  name: string
  total_payment: number
  recipient: string
  branch: string
  status: "Active" | "Inactive"
}

export interface ExpenseItem extends ExpenseSubItem {
  children?: ExpenseSubItem[]
}

export interface NetItem {
  id: number
  full_name: string
  category: string
  date: string
  amount: number
}

export interface AccountantItem {
  id: number
  started_at: string
  finished_at: string
  total_income: number
  total_expense: number
  paid: number
  not_paid: number
  net: number
  branch: string
  status: "Inprogress" | "Archive"
}

export interface AccountantChartPoint {
  month: string
  income: number
  expense: number
}

export interface AccountingStats {
  total_payment: number
  paid_amount: number
  not_paid: number
  net: number
}

export interface AccountingChartPoint {
  month: string
  Income: number
  Expense: number
}

export interface StudentsPaymentMember {
  id: number
  full_name: string
  phone: string
  sum: number
  status: "Paid" | "Not paid"
}

export interface StudentsPaymentGroup {
  id: number
  group: string
  students: number
  not_paid: number
  total: number
  not_paid_amount: number
  members: StudentsPaymentMember[]
}

export const accountingApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAccountingStats: build.query<AccountingStats, void>({
      query: () => ({ url: "/accounting/overview" }),
    }),
    getAccountingChart: build.query<{ data: AccountingChartPoint[] }, { year: number }>({
      query: (params) => ({ url: "/accounting/overview/chart", params }),
    }),
    getStudentsPayment: build.query<
      { donut: { total: number; paid_percent: number; paid_count: number; not_paid_percent: number; not_paid_count: number }; groups: StudentsPaymentGroup[] },
      void
    >({
      query: () => ({ url: "/accounting/overview/students-payment" }),
    }),

    getPayments: build.query<Envelope<Payment>, { search?: string; group_id?: string; branch_id?: string; status?: string } | void>({
      query: (params) => ({ url: "/payments", params: params ?? {} }),
      providesTags: ["Payments"],
    }),
    createPrepayment: build.mutation<{ success: boolean }, Record<string, unknown>>({
      query: (data) => ({ url: "/payments/prepayment", method: "post", data }),
      invalidatesTags: ["Payments"],
    }),
    createPayment: build.mutation<Payment, Partial<Payment>>({
      query: (data) => ({ url: "/payments", method: "post", data }),
      invalidatesTags: ["Payments"],
    }),
    updatePayment: build.mutation<Payment, { id: number; data: Partial<Payment> }>({
      query: ({ id, data }) => ({ url: `/payments/${id}`, method: "put", data }),
      invalidatesTags: ["Payments"],
    }),
    deletePayment: build.mutation<{ success: boolean }, number>({
      query: (id) => ({ url: `/payments/${id}`, method: "delete" }),
      invalidatesTags: ["Payments"],
    }),

    getBudget: build.query<Envelope<BudgetItem>, { status?: string } | void>({
      query: (params) => ({ url: "/accounting/budget", params: params ?? {} }),
      providesTags: ["Budget"],
    }),
    getBudgetChart: build.query<{ data: BudgetChartPoint[] }, { from: number; to: number }>({
      query: (params) => ({ url: "/accounting/budget/chart", params }),
    }),
    createBudget: build.mutation<BudgetItem, Partial<BudgetItem>>({
      query: (data) => ({ url: "/accounting/budget", method: "post", data }),
      invalidatesTags: ["Budget"],
    }),
    updateBudget: build.mutation<BudgetItem, { id: number; data: Partial<BudgetItem> }>({
      query: ({ id, data }) => ({ url: `/accounting/budget/${id}`, method: "put", data }),
      invalidatesTags: ["Budget"],
    }),

    getSalary: build.query<Envelope<SalaryItem>, { search?: string; date?: string } | void>({
      query: (params) => ({ url: "/accounting/salary", params: params ?? {} }),
      providesTags: ["Salary"],
    }),
    updateSalary: build.mutation<SalaryItem, { id: number; data: Partial<SalaryItem> }>({
      query: ({ id, data }) => ({ url: `/accounting/salary/${id}`, method: "put", data }),
      invalidatesTags: ["Salary"],
    }),
    deleteSalary: build.mutation<{ success: boolean }, number>({
      query: (id) => ({ url: `/accounting/salary/${id}`, method: "delete" }),
      invalidatesTags: ["Salary"],
    }),

    getAvans: build.query<Envelope<AvansItem>, { search?: string; status?: string } | void>({
      query: (params) => ({ url: "/accounting/avans", params: params ?? {} }),
      providesTags: ["Avans"],
    }),
    updateAvans: build.mutation<AvansItem, { id: number; data: Partial<AvansItem> }>({
      query: ({ id, data }) => ({ url: `/accounting/avans/${id}`, method: "put", data }),
      invalidatesTags: ["Avans"],
    }),

    getDebtors: build.query<Envelope<DebtorItem>, { search?: string; status?: string } | void>({
      query: (params) => ({ url: "/accounting/debtors", params: params ?? {} }),
      providesTags: ["Debtors"],
    }),
    createDebtor: build.mutation<DebtorItem, Partial<DebtorItem>>({
      query: (data) => ({ url: "/accounting/debtors", method: "post", data }),
      invalidatesTags: ["Debtors"],
    }),
    updateDebtor: build.mutation<DebtorItem, { id: number; data: Partial<DebtorItem> }>({
      query: ({ id, data }) => ({ url: `/accounting/debtors/${id}`, method: "put", data }),
      invalidatesTags: ["Debtors"],
    }),

    getExpenses: build.query<{ data: ExpenseItem[] }, { category?: string; branch_id?: string } | void>({
      query: (params) => ({ url: "/accounting/expenses", params: params ?? {} }),
      providesTags: ["Expenses"],
    }),

    getNet: build.query<Envelope<NetItem>, { category?: string } | void>({
      query: (params) => ({ url: "/accounting/net", params: params ?? {} }),
    }),

    getAccountant: build.query<Envelope<AccountantItem>, { status?: string; branch_id?: string } | void>({
      query: (params) => ({ url: "/accounting/accountant", params: params ?? {} }),
    }),
    getAccountantChart: build.query<{ data: AccountantChartPoint[] }, { year: number }>({
      query: (params) => ({ url: "/accounting/accountant/chart", params }),
    }),
  }),
})

export const {
  useGetAccountingStatsQuery,
  useGetAccountingChartQuery,
  useGetStudentsPaymentQuery,
  useGetPaymentsQuery,
  useCreatePrepaymentMutation,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
  useGetBudgetQuery,
  useGetBudgetChartQuery,
  useCreateBudgetMutation,
  useUpdateBudgetMutation,
  useGetSalaryQuery,
  useUpdateSalaryMutation,
  useDeleteSalaryMutation,
  useGetAvansQuery,
  useUpdateAvansMutation,
  useGetDebtorsQuery,
  useCreateDebtorMutation,
  useUpdateDebtorMutation,
  useGetExpensesQuery,
  useGetNetQuery,
  useGetAccountantQuery,
  useGetAccountantChartQuery,
} = accountingApi
