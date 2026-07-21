import type { ReactNode } from "react"
import { Calendar } from "lucide-react"

import { cn } from "@/lib/utils"

export function FilterField({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("relative", className)}>
      <span className="absolute -top-2.5 left-3 z-10 bg-background px-1 text-xs text-muted-foreground">
        {label}
      </span>
      <div className="flex h-11 items-center rounded-lg border border-input bg-card px-3.5 text-sm">
        {children}
      </div>
    </div>
  )
}

export function DateField({
  label,
  value,
  onChange,
  className,
}: {
  label: string
  value: string
  onChange?: (value: string) => void
  className?: string
}) {
  return (
    <FilterField label={label} className={className}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full bg-transparent text-sm outline-none"
        readOnly={!onChange}
      />
      <Calendar className="size-4 shrink-0 text-muted-foreground" />
    </FilterField>
  )
}
