import { ExternalLink, Clock } from 'lucide-react'
import type { NewsItem } from '../types'
import { SourceBadge } from './SourceBadge'
import { formatDateTime } from '../utils/formatDate'

interface NewsCardProps {
  item: NewsItem
  index: number
}

export function NewsCard({ item, index }: NewsCardProps) {
  return (
    <a
      href={item.url}
      target="_blank"rel="noopener noreferrer"className="group block bg-surface dark:bg-surface-dark border border-outline dark:border-outline-dark rounded-lg px-5 py-4 transition-colors hover:border-primary dark:hover:border-primary-dark"style={{ animationDelay: `${Math.min(index * 24, 240)}ms` }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <SourceBadge siteId={item.site_id} siteName={item.site_name} />
            {item.source && item.source !== item.site_name && (
              <span className="text-label text-ink-secondary dark:text-ink-muted truncate max-w-[220px]">
                {item.source}
              </span>
            )}
          </div>

          <h3 className="text-title text-ink dark:text-ink-dark leading-snug group-hover:text-primary dark:group-hover:text-primary-dark transition-colors line-clamp-2">
            {item.title}
          </h3>

          <div className="flex items-center gap-1.5 mt-3 text-label text-ink-secondary dark:text-ink-muted">
            <Clock className="w-4 h-4" />
            {formatDateTime(item.published_at)}
          </div>
        </div>

        <ExternalLink className="w-5 h-5 flex-shrink-0 text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
      </div>
    </a>
  )
}
