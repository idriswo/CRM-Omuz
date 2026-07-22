import { Bell, Mail } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useGetNotificationsQuery } from "@/store/services"

export function NotificationDropdown() {
  const { data } = useGetNotificationsQuery()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative rounded-md p-2 hover:bg-accent" aria-label="Notifications">
          <Bell className="size-5 text-primary" />
          {data?.data?.some((n) => !n.read) && (
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between rounded-t-lg bg-primary px-4 py-3 text-primary-foreground">
          <span className="font-semibold">Notification</span>
          <Mail className="size-4" />
        </div>
        <div className="flex max-h-96 flex-col divide-y divide-border overflow-y-auto">
          {data?.data?.map((n) => (
            <div key={n.id} className="flex flex-col gap-1 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{n.from}</span>
                {n.read ? (
                  <span className="text-success">✓</span>
                ) : (
                  <span className="size-2 rounded-full bg-success" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">{n.message}</p>
              <div className="flex items-center justify-between pt-1">
                <button className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                  More ›
                </button>
                <span className="text-xs text-muted-foreground">{n.date}</span>
              </div>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
