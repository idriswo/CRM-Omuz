import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"
import welcome3d from "@/assets/brand/welcome-3d.png"
import welcomeLines from "@/assets/brand/welcome-lines.png"

/**
 * Composed from the isolated design assets (logo, 3D graduation cap/ring render,
 * decorative line swirl) rather than a flattened screenshot, so it scales cleanly.
 */
export function WelcomeIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("bg-accent", className)}>
      <div className="relative flex h-full w-full flex-col overflow-hidden p-10 md:p-14">
        <div className="relative z-10">
          <p className="text-2xl font-semibold text-accent-foreground md:text-3xl">
            Welcome to
          </p>
          <Logo className="mt-2 h-9 w-auto md:h-11" />
        </div>

        <img
          src={welcomeLines}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-0 bottom-0 h-[75%] w-[75%] object-contain object-right-bottom opacity-90"
        />

        <img
          src={welcome3d}
          alt="Welcome to ômuz"
          className="pointer-events-none relative z-10 mt-4 h-0 min-h-0 w-full flex-1 object-contain object-center"
        />
      </div>
    </div>
  )
}
