import type { ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export function AccountingHeader({ title, actions }: { title: string; actions?: ReactNode }) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/accounting")}
          aria-label="Back to accounting"
          className="rounded-md p-1.5 hover:bg-accent"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}
