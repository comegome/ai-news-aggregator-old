import { Loader2 } from 'lucide-react'
import type { SiteStat } from '../types'
import type { SourceStat, TimeRange } from '../hooks/useNewsData'

interface FilterBarProps {
  siteStats: SiteStat[]
  sourceStats: SourceStat[]
  selectedSite: string
  onSiteChange: (site: string) => void
  selectedSource: string
  onSourceChange: (source: string) => void
  totalItems: number
  sourceCount: number
  timeRange: TimeRange
  onTimeRangeChange: (range: TimeRange) => void
  isSwitching: boolean
}

export function FilterBar({
  siteStats,
  sourceStats,
  selectedSite,
  onSiteChange,
  selectedSource,
  onSourceChange,
  totalItems,
  sourceCount,
  timeRange,
  onTimeRangeChange,
  isSwitching,
}: FilterBarProps) {
  const activeSites = siteStats.filter((s) => s.count > 0)

  return (
    <div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button className="chip" data-active={selectedSite === 'all'} onClick={() => onSiteChange('all')}>
          全部
        </button>
        {activeSites.map((site) => (
          <button
            key={site.site_id}
            className="chip"
            data-active={selectedSite === site.site_id}
            onClick={() => onSiteChange(site.site_id)}
          >
            {site.site_name}
            <span className="text-ink-muted">{site.count}</span>
          </button>
        ))}
      </div>

      {selectedSite !== 'all' && sourceStats.length > 0 && (
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button className="chip h-7" data-active={selectedSource === 'all'} onClick={() => onSourceChange('all')}>
            全部来源
          </button>
          {sourceStats.map((source) => (
            <button
              key={source.source}
              className="chip h-7 max-w-[200px]"
              data-active={selectedSource === source.source}
              onClick={() => onSourceChange(source.source)}
              title={source.source}
            >
              <span className="truncate">{source.source}</span>
              <span className="text-ink-muted">{source.count}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between border-b border-hairline pb-3 text-meta text-ink-secondary dark:border-hairline-dark dark:text-ink-dark-secondary">
        <span className="flex items-center gap-1.5">
          {isSwitching && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary dark:text-primary-dark" />}
          {totalItems.toLocaleString()} 条 · {activeSites.length} 个平台 · {sourceCount} 个源
        </span>

        <div className="flex items-center gap-1">
          {(['24h', '7d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => onTimeRangeChange(range)}
              disabled={isSwitching}
              className={`rounded-full px-3 py-1 transition-colors ${
                timeRange === range
                  ? 'bg-primary-container font-medium text-primary-strong dark:bg-primary-container-dark dark:text-primary-dark'
                  : 'hover:bg-surface-subtle dark:hover:bg-surface-subtle-dark'
              }`}
            >
              {range === '24h' ? '24 小时' : '7 天'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
