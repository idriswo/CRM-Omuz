/**
 * Turns an RTK Query error into a message we can show the user.
 *
 * The backend answers with Tajik strings (`{ message: "..." }`) and maps Prisma
 * failures onto HTTP codes in `error.middleware.ts`:
 *   409 — foreign-key (P2003) or unique (P2002) conflict
 *   404 — record not found (P2025)
 * So status codes are the reliable signal; the server text is only a fallback.
 */

/** Covers both RTK Query's `{ status, data }` and a raw AxiosError, since the
 * leads export bypasses RTK and calls axios directly. */
interface ApiErrorShape {
  status?: number
  data?: unknown
  response?: { status?: number; data?: unknown }
}

function serverMessage(error: ApiErrorShape): string | undefined {
  const data = error?.data ?? error?.response?.data
  if (typeof data === "string") return data
  if (data && typeof data === "object" && "message" in data) {
    const message = (data as { message?: unknown }).message
    if (typeof message === "string") return message
  }
  return undefined
}

export function apiErrorMessage(
  error: unknown,
  options: { conflict?: string; fallback?: string } = {}
): string {
  const err = (error ?? {}) as ApiErrorShape

  switch (err.status ?? err.response?.status) {
    case 409:
      return options.conflict ?? "This record is used elsewhere, so it can't be changed."
    case 403:
      return "You don't have permission to do this."
    case 404:
      return "This record no longer exists — refresh the page."
    case 401:
      return "Your session has expired. Please log in again."
  }

  return serverMessage(err) ?? options.fallback ?? "Something went wrong. Please try again."
}
