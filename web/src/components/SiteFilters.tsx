import { X } from 'lucide-react'
import type { SiteStat } from '../types'
import type { SourceStat } from '../hooks/useNewsData'

interface SiteFiltersProps {
  siteStats: SiteStat[]
  sourceStats: SourceStat[]
  selectedSite: string
  onSiteChange: (site: string) => void
  selectedSource: string
  onSourceChange: (source: string) => void
}

const CHIP_BASE =
  'px-3 py-1.5 rounded-full text-label transition-colors flex items-center gap-1.5'
const CHIP_IDLE =
  'bg-surface-variant text-ink-secondary dark:bg-surface-variant-dark dark:text-ink-dark hover:bg-outline dark:hover:bg-outline-dark'
const CHIP_ACTIVE = 'bg-primary text-on-primary'

export function SiteFilters({
  siteStats,
  sourceStats,
  selectedSite,
  onSiteChange,
  selectedSource,
  onSourceChange,
}: SiteFiltersProps) {
  const activeSites = siteStats.filter((site) => site.count > 0)

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSiteChange('all')}
          className={`${CHIP_BASE} ${selectedSite === 'all' ? CHIP_ACTIVE : CHIP_IDLE}`}
        >
          <span>全部</span>
        </button>

        {activeSites.map((site) => {
          const isSelected = selectedSite === site.site_id
          return (
            <button
              key={site.site_id}
              onClick={() => onSiteChange(site.site_id)}
              className={`${CHIP_BASE} ${isSelected ? CHIP_ACTIVE : CHIP_IDLE}`}
            >
              <span>{site.site_name}</span>
              <span className={isSelected ? 'text-on-primary/80' : 'text-ink-muted'}>
                {site.count}
              </span>
            </button>
          )
        })}
      </div>

      {selectedSite !== 'all' && sourceStats.length > 0 && (
        <div className="pt-3 border-t border-outline dark:border-outline-dark">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-label text-ink-secondary dark:text-ink-muted flex-shrink-0">
              订阅源
            </span>
            {selectedSource !== 'all' && (
              <button
                onClick={() => onSourceChange('all')}
                className="text-label text-primary dark:text-primary-dark hover:underline flex items-center gap-0.5 flex-shrink-0"
              >
                <X className="w-3 h-3" />
                清除
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
            {sourceStats.map((source) => {
              const isSelected = selectedSource === source.source
              return (
                <button
                  key={source.source}
                  onClick={() => onSourceChange(source.source)}
                  className={`px-2.5 py-1 rounded-md text-label transition-colors ${
                    isSelected ? CHIP_ACTIVE : CHIP_IDLE
                  }`}
                  title={source.source}
                >
                  <span className="max-w-[140px] truncate inline-block align-bottom">
                    {source.source}
                  </span>
                  <span className={`ml-1 ${isSelected ? 'text-on-primary/80' : 'text-ink-muted'}`}>
                    {source.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
