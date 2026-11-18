export function LoadingState() {
  return (
    <div className="divide-y divide-hairline dark:divide-hairline-dark">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="py-4">
          <div className="h-3 w-28 animate-pulse rounded bg-surface-subtle dark:bg-surface-subtle-dark" />
          <div className="mt-2.5 h-4 w-full animate-pulse rounded bg-surface-subtle dark:bg-surface-subtle-dark" />
          <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-surface-subtle dark:bg-surface-subtle-dark" />
        </div>
      ))}
    </div>
  )
}
