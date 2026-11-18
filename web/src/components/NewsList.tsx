import type { NewsItem } from '../types'
import { NewsCard } from './NewsCard'
import { LoadingState } from './LoadingState'
import { EmptyState } from './EmptyState'
import { ChevronDown } from 'lucide-react'

interface NewsListProps {
  items: NewsItem[]
  loading: boolean
  error: string | null
  hasMore: boolean
  onLoadMore: () => void
}

export function NewsList({ items, loading, error, hasMore, onLoadMore }: NewsListProps) {
  if (loading && items.length === 0) {
    return <LoadingState />
  }

  if (error) {
    return (
      <div className="bg-surface dark:bg-surface-dark border border-outline dark:border-outline-dark rounded-lg p-8 text-center">
        <div className="text-red-600 dark:text-red-400 mb-2 text-title">加载失败</div>
        <p className="text-body text-ink-secondary dark:text-ink-muted">{error}</p>
      </div>
    )
  }

  if (items.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <NewsCard key={item.id} item={item} index={index} />
      ))}

      {hasMore && (
        <div className="flex justify-center pt-6">
          <button
            onClick={onLoadMore}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-outline dark:border-outline-dark text-label text-ink-secondary dark:text-ink-muted hover:bg-surface-variant dark:hover:bg-surface-variant-dark hover:text-ink dark:hover:text-ink-dark transition-colors">
            <span>加载更多</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
