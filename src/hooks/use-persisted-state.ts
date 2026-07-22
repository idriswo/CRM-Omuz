import { useEffect, useState } from "react"

/**
 * useState backed by localStorage, so UI preferences (grid/list view, tabs)
 * survive navigation and full page reloads.
 */
export function usePersistedState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored === null ? fallback : (JSON.parse(stored) as T)
    } catch {
      return fallback
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage unavailable (private mode / quota) - keep in-memory state */
    }
  }, [key, value])

  return [value, setValue] as const
}
