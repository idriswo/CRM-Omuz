export interface Envelope<T> {
  data: T[]
  meta: { total: number; page: number; limit: number }
}

export interface ListParams {
  search?: string
  page?: number
  limit?: number
}
