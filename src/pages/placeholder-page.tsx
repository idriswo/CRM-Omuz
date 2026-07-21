export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground">
        This section is being built by another teammate — not part of this slice.
      </p>
    </div>
  )
}
