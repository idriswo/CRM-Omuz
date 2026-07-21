import { cn } from "@/lib/utils"
import type { Coupon } from "./mock-data"

// Simple "JS" style badge used across course cards/table.
export function JsLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-yellow-400 font-extrabold text-neutral-900",
        className
      )}
    >
      JS
    </div>
  )
}

const couponLogo: Record<Coupon["logo"], { label: string; className: string }> = {
  cpp: { label: "C++", className: "bg-blue-500 text-white text-[11px]" },
  htmlcss: { label: "H5", className: "bg-orange-500 text-white text-xs" },
  js: { label: "JS", className: "bg-yellow-400 text-neutral-900 text-xs" },
  react: { label: "⚛", className: "bg-neutral-900 text-cyan-400 text-base" },
}

export function CouponLogo({ logo, className }: { logo: Coupon["logo"]; className?: string }) {
  const cfg = couponLogo[logo]
  return (
    <div
      className={cn(
        "flex size-10 items-center justify-center rounded-full font-extrabold",
        cfg.className,
        className
      )}
    >
      {cfg.label}
    </div>
  )
}
