import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

/** Page list with ellipses: 1 … 4 5 [6] 7 8 … 20 */
function pageWindow(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | "gap")[] = [1]
  const from = Math.max(2, current - 1)
  const to = Math.min(total - 1, current + 1)

  if (from > 2) pages.push("gap")
  for (let page = from; page <= to; page++) pages.push(page)
  if (to < total - 1) pages.push("gap")
  pages.push(total)

  return pages
}

/** Driven by the backend's `meta: { total, page, limit }` envelope. Renders
 * nothing when everything already fits on one page. */
export function Pagination({
  page,
  limit,
  total,
  onPageChange,
  className,
}: {
  page: number
  limit: number
  total: number
  onPageChange: (page: number) => void
  className?: string
}) {
  const pageCount = Math.max(1, Math.ceil(total / limit))
  if (total === 0 || pageCount <= 1) return null

  const first = (page - 1) * limit + 1
  const last = Math.min(page * limit, total)

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-4", className)}>
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{first}</span>–
        <span className="font-medium text-foreground">{last}</span> of{" "}
        <span className="font-medium text-foreground">{total}</span>
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="flex size-9 items-center justify-center rounded-lg border border-input text-muted-foreground transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
        </button>

        {pageWindow(page, pageCount).map((entry, index) =>
          entry === "gap" ? (
            <span key={`gap-${index}`} className="px-1.5 text-muted-foreground">
              …
            </span>
          ) : (
            <button
              key={entry}
              type="button"
              onClick={() => onPageChange(entry)}
              aria-current={entry === page ? "page" : undefined}
              className={cn(
                "flex size-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors",
                entry === page
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input text-muted-foreground hover:bg-accent"
              )}
            >
              {entry}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          aria-label="Next page"
          className="flex size-9 items-center justify-center rounded-lg border border-input text-muted-foreground transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}
