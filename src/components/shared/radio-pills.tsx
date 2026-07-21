import { cn } from "@/lib/utils"

export function RadioPills<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <div className="flex items-center gap-2.5">
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex h-11 flex-1 items-center justify-center gap-2.5 rounded-lg border border-input bg-card px-4 text-sm transition-colors hover:bg-accent/40",
              selected && "border-primary"
            )}
          >
            <span
              className={cn(
                "flex size-4 items-center justify-center rounded-full border-2 border-muted-foreground/50",
                selected && "border-primary"
              )}
            >
              {selected && <span className="size-2 rounded-full bg-primary" />}
            </span>
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
