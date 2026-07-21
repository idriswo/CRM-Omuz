import { cn } from "@/lib/utils"

/** Joined two-state switch (Active | Inactive) used by the edit forms. */
export function SegmentedToggle<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-input bg-muted/60">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          onClick={() => onChange(option.value)}
          className={cn(
            "h-11 px-8 text-sm font-semibold transition-colors hover:text-foreground",
            option.value === value
              ? "bg-card text-primary shadow-xs"
              : "text-muted-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
