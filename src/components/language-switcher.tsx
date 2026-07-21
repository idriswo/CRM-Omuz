import { useState } from "react"
import { ChevronDown } from "lucide-react"
import gbFlag from "flag-icons/flags/4x3/gb.svg"
import tjFlag from "flag-icons/flags/4x3/tj.svg"
import ruFlag from "flag-icons/flags/4x3/ru.svg"

import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const languages = [
  { code: "en", label: "EN", flag: gbFlag },
  { code: "tj", label: "TJ", flag: tjFlag },
  { code: "ru", label: "RU", flag: ruFlag },
]

export function LanguageSwitcher({ className }: { className?: string }) {
  const [lang, setLang] = useState(languages[0])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-2 rounded-lg border border-input bg-card px-2.5 py-2 text-sm font-semibold outline-none focus-visible:ring-4 focus-visible:ring-ring",
          className
        )}
      >
        <img src={lang.flag} alt="" className="h-3.5 w-5 rounded-[2px] object-cover" />
        {lang.label}
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((l) => (
          <DropdownMenuItem key={l.code} onSelect={() => setLang(l)}>
            <img src={l.flag} alt="" className="h-3.5 w-5 rounded-[2px] object-cover" />
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
