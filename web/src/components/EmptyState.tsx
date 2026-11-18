import { SearchX } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="card p-12 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-variant dark:bg-surface-dark mb-4">
        <SearchX className="w-8 h-8 text-ink-muted" />
      </div>
      <h3 className="text-lg font-medium text-ink dark:text-on-primary mb-2">
        没有找到相关资讯
      </h3>
      <p className="text-ink-secondary dark:text-ink-muted">
        尝试调整筛选条件或搜索关键词
      </p>
    </div>
  )
}
