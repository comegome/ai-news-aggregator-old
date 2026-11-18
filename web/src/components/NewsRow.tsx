import type { NewsItem } from '../types'
import { formatRelativeTime } from '../utils/formatDate'

interface NewsRowProps {
  item: NewsItem
}

export function NewsRow({ item }: NewsRowProps) {
  const showSource = item.source && item.source !== item.site_name

  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" className="row group">
      <div className="flex items-center gap-1.5 text-meta text-ink-secondary dark:text-ink-dark-secondary">
        <span className="truncate">{item.site_name}</span>
        <span className="text-ink-muted">·</span>
        <span className="shrink-0">{formatRelativeTime(item.published_at)}</span>
      </div>

      <h3 className="mt-1 text-headline text-ink group-hover:underline dark:text-ink-dark">
        {item.title}
      </h3>

      {showSource && (
        <p className="mt-1 truncate text-meta text-ink-muted">{item.source}</p>
      )}
    </a>
  )
}
