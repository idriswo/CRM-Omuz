export interface Envelope<T> {
  data: T[]
  meta: { total: number; page: number; limit: number }
}

export interface ListParams {
  search?: string
  page?: number
  limit?: number
}

/**
 * Several endpoints answer with a bare array instead of the `{ data, meta }`
 * envelope the rest of the API uses (`/email/templates`, `/email/recipients/*`,
 * `/permissions`, `/accounting/accountant`, most `/dashboard/*` lists…).
 * Reading `.data` off an array silently yields `undefined`, so the screen looks
 * empty rather than broken — normalize both shapes here instead.
 */
export function toEnvelope<T>(response: T[] | Envelope<T> | undefined | null): Envelope<T> {
  if (Array.isArray(response)) {
    return { data: response, meta: { total: response.length, page: 1, limit: response.length } }
  }
  const data = response?.data ?? []
  return {
    data,
    meta: response?.meta ?? { total: data.length, page: 1, limit: data.length },
  }
}

/** Same normalization for endpoints whose consumers only need `{ data }`. */
export function toList<T>(response: T[] | { data?: T[] } | undefined | null): { data: T[] } {
  if (Array.isArray(response)) return { data: response }
  return { data: response?.data ?? [] }
}
