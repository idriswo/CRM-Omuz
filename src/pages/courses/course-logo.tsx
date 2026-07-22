import { cn } from "@/lib/utils"

/** Well-known course names get their familiar badge; everything else falls back
 * to initials + a colour derived from the name, so the logo is a pure function
 * of real course data (the API has no logo field). */
const KNOWN: { match: RegExp; label: string; className: string }[] = [
  { match: /^js|javascript/i, label: "JS", className: "bg-yellow-400 text-neutral-900" },
  { match: /^ts|typescript/i, label: "TS", className: "bg-blue-500 text-white" },
  { match: /react/i, label: "⚛", className: "bg-neutral-900 text-cyan-400" },
  { match: /c\+\+|cpp/i, label: "C++", className: "bg-blue-600 text-white" },
  { match: /c#|\.net|dotnet/i, label: "C#", className: "bg-violet-600 text-white" },
  { match: /html|css/i, label: "H5", className: "bg-orange-500 text-white" },
  { match: /python/i, label: "Py", className: "bg-sky-600 text-white" },
  { match: /scratch/i, label: "Sc", className: "bg-amber-500 text-white" },
  { match: /olymp/i, label: "Ol", className: "bg-emerald-600 text-white" },
]

const FALLBACKS = [
  "bg-teal-500 text-white",
  "bg-indigo-500 text-white",
  "bg-rose-500 text-white",
  "bg-lime-500 text-neutral-900",
  "bg-fuchsia-500 text-white",
]

function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return "?"
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

function hash(value: string) {
  let total = 0
  for (const char of value) total = (total * 31 + char.charCodeAt(0)) >>> 0
  return total
}

export function CourseLogo({ name, className }: { name: string; className?: string }) {
  const known = KNOWN.find((k) => k.match.test(name))
  const label = known?.label ?? initials(name)
  const color = known?.className ?? FALLBACKS[hash(name) % FALLBACKS.length]

  return (
    <div
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold",
        color,
        className
      )}
    >
      {label}
    </div>
  )
}
