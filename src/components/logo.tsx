import logoImg from "@/assets/brand/omuz-logo.png"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <img
      src={logoImg}
      alt="ômuz"
      className={cn("h-8 w-auto select-none object-contain object-left", className)}
      draggable={false}
    />
  )
}
