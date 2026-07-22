import { useEffect, useState } from "react"

/** Keeps a value stable for `delay` ms so a fast typist doesn't fire a request
 * per keystroke. Returns the previous value until typing pauses. */
export function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
