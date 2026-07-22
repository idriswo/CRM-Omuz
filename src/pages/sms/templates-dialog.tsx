import { useState } from "react"
import { Pencil, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  useCreateSmsTemplateMutation,
  useDeleteSmsTemplateMutation,
  useGetSmsTemplatesQuery,
} from "@/store/services"

export function TemplatesDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const { data } = useGetSmsTemplatesQuery()
  const [createTemplate, { isLoading }] = useCreateSmsTemplateMutation()
  const [deleteTemplate] = useDeleteSmsTemplateMutation()

  const handleCreate = async () => {
    if (!title.trim()) return
    await createTemplate({ title, description })
    setTitle("")
    setDescription("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Templates</DialogTitle>
        </DialogHeader>

        <div className="rounded-xl border border-border p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold">Add new</span>
            <button
              onClick={() => {
                setTitle("")
                setDescription("")
              }}
              className="rounded-md bg-primary/10 p-1 text-primary hover:bg-primary/20"
              aria-label="Clear"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-input bg-card px-3.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-ring"
            />
            <Button onClick={handleCreate} disabled={isLoading} className="w-fit">
              Create
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {data?.data?.map((t) => (
            <div key={t.id} className="rounded-xl border border-border p-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-semibold">{t.title}</span>
                <div className="flex items-center gap-1">
                  <button className="rounded-md p-1.5 text-primary hover:bg-accent" aria-label="Edit">
                    <Pencil className="size-4" />
                  </button>
                  <button
                    className="rounded-md p-1.5 text-destructive hover:bg-accent"
                    aria-label="Delete"
                    onClick={() => deleteTemplate(t.id)}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <p className="whitespace-pre-line text-sm text-muted-foreground">{t.description}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
