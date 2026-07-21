import type * as React from "react"
import { User } from "lucide-react"

import { cn } from "@/lib/utils"

export function Avatar({
  src,
  alt,
  className,
  style,
}: {
  src?: string | null
  alt?: string
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <span
      style={style}
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground",
        className
      )}
    >
      {src ? (
        <img src={src} alt={alt ?? ""} className="size-full object-cover" />
      ) : (
        <User className="size-1/2" />
      )}
    </span>
  )
}
