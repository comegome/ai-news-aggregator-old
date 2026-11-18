import { SearchX } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="py-24 text-center">
      <SearchX className="mx-auto h-8 w-8 text-ink-muted" strokeWidth={1.5} />
      <p className="mt-4 text-title text-ink dark:text-ink-dark">没有匹配的资讯</p>
      <p className="mt-1 text-meta text-ink-secondary dark:text-ink-dark-secondary">
        换个关键词，或把平台筛选切回「全部」
      </p>
    </div>
  )
}
