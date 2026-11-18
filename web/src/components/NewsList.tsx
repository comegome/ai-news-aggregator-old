import type { NewsItem } from '../types'
import { NewsRow } from './NewsRow'
import { LoadingState } from './LoadingState'
import { EmptyState } from './EmptyState'

interface NewsListProps {
  items: NewsItem[]
  loading: boolean
  error: string | null
  hasMore: boolean
  onLoadMore: () => void
}

export function NewsList({ items, loading, error, hasMore, onLoadMore }: NewsListProps) {
  if (loading && items.length === 0) return <LoadingState />

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-title text-ink dark:text-ink-dark">加载失败</p>
        <p className="mt-1 text-meta text-ink-secondary dark:text-ink-dark-secondary">{error}</p>
      </div>
    )
  }

  if (items.length === 0) return <EmptyState />

  return (
    <div>
      <div className="divide-y divide-hairline dark:divide-hairline-dark">
        {items.map((item) => (
          <NewsRow key={item.id} item={item} />
        ))}
      </div>

      {hasMore && (
        <div className="py-8 text-center">
          <button
            onClick={onLoadMore}
            className="rounded-full px-5 py-2 text-title text-primary transition-colors hover:bg-primary-container dark:text-primary-dark dark:hover:bg-primary-container-dark"
          >
            加载更多
          </button>
        </div>
      )}
    </div>
  )
}
