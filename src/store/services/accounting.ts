import { api } from "@/store/api"
import { toEnvelope, type Envelope } from "./types"

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

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

/** Exactly what `GET /accounting/accountant` returns — one row per employee that
 * has a salary or an advance on record (bare array, no envelope). */
export interface AccountantItem {
  employee_id: number
  full_name: string
  position: string
  total_salary: number
  total_avans: number
}

export interface AccountantChartPoint {
  month: string
  salary: number
  avans: number
}

/** Exactly what `GET /accounting/overview` returns. The salary fields are only
 * present for roles allowed to see them, hence optional. */
export interface AccountingStats {
  total_income: number
  total_expenses: number
  budget_allocated: number
  budget_spent: number
  total_debt: number
  total_debt_paid: number
  total_salaries?: number
  total_avans?: number
  net?: number
}

export interface AccountingChartPoint {
  month: string
  Income: number
  Expense: number
}

/** One row per student that has at least one payment. */
export interface StudentsPaymentRow {
  student_id: number
  full_name: string
  total_amount: number
  total_paid: number
  remaining: number
}

export const accountingApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAccountingStats: build.query<AccountingStats, void>({
      query: () => ({ url: "/accounting/overview" }),
    }),
    getAccountingChart: build.query<{ data: AccountingChartPoint[] }, { year: number }>({
      query: (params) => ({ url: "/accounting/overview/chart", params }),
      // `{ "5": { income, expenses, ... } }` keyed by month number.
      transformResponse: (
        response: Record<string, { income?: number; expenses?: number; salaries?: number; avans?: number }>
      ) => ({
        data: MONTHS.map((month, i) => {
          const row = response?.[String(i + 1)]
          return {
            month,
            Income: row?.income ?? 0,
            Expense: (row?.expenses ?? 0) + (row?.salaries ?? 0) + (row?.avans ?? 0),
          }
        }),
      }),
    }),
    getStudentsPayment: build.query<Envelope<StudentsPaymentRow>, void>({
      query: () => ({ url: "/accounting/overview/students-payment" }),
      transformResponse: toEnvelope<StudentsPaymentRow>,
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
      transformResponse: toEnvelope<AccountantItem>,
    }),
    getAccountantChart: build.query<{ data: AccountantChartPoint[] }, { year: number }>({
      query: (params) => ({ url: "/accounting/accountant/chart", params }),
      // `{ "5": { salary, avans } }` keyed by month number — expand to 12 points.
      transformResponse: (response: Record<string, { salary?: number; avans?: number }>) => ({
        data: MONTHS.map((month, i) => ({
          month,
          salary: response?.[String(i + 1)]?.salary ?? 0,
          avans: response?.[String(i + 1)]?.avans ?? 0,
        })),
      }),
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
