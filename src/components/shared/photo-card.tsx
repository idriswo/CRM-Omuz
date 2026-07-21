import { FilePlus2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

/**
 * Photo panel used by the student form and contract screens: an empty state with a
 * dropzone, and a circular preview once a picture is chosen.
 */
export function PhotoCard({
  photo,
  onChange,
  title = "Photo",
}: {
  photo: string | null
  onChange: (photo: string | null) => void
  title?: string
}) {
  return (
    <Card className="h-fit gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        <Button
          type="button"
          variant="ghost"
          className="text-muted-foreground"
          onClick={() => onChange(null)}
        >
          <Trash2 className="size-4" /> Remove foto
        </Button>
      </div>

      {photo ? (
        <div className="flex justify-center py-4">
          <img src={photo} alt="" className="size-44 rounded-full object-cover" />
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-14 text-center transition-colors hover:border-primary/60">
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onChange(URL.createObjectURL(file))
            }}
          />
          <FilePlus2 className="size-10 text-muted-foreground" />
          <span className="font-semibold">Select file</span>
          <span className="text-sm text-muted-foreground">
            Click or drag file to this area to upload
          </span>
        </label>
      )}

      <div className="flex items-center justify-center gap-3">
        <Button type="button" variant="ghost" className="bg-accent text-primary" asChild>
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) onChange(URL.createObjectURL(file))
              }}
            />
            Choose avatar
          </label>
        </Button>
        <Button type="button" disabled={!photo}>
          Save
        </Button>
      </div>
    </Card>
  )
}
