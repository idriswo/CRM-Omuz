import { ChevronDown } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/** Primary phone with the extra contacts (father, etc.) revealed on click. */
export function PhoneCell({
  phone,
  contacts,
}: {
  phone: string
  contacts: { label: string; number: string }[]
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-1.5 outline-none hover:text-primary">
        {phone}
        <ChevronDown className="size-4 text-primary" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-44 p-0">
        {contacts.map((contact) => (
          <div key={contact.label} className="border-b border-border px-4 py-2.5 last:border-0">
            <p className="text-xs text-muted-foreground">{contact.label}</p>
            <p className="font-semibold">{contact.number}</p>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
