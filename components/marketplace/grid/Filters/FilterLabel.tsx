export const FilterLabel = ({ children }: { children: string }) => {
  return (
    <div className="my-2 px-2 text-sm font-bold uppercase tracking-wider text-accent-foreground">
      {children}
    </div>
  )
}