import { FileText, Database } from 'lucide-react'
import type { SiteStat } from '../types'

interface StatsCardsProps {
  totalItems: number
  sourceCount: number
  windowHours: number
  siteStats: SiteStat[]
  onShowSources: () => void
}

export function StatsCards({ totalItems, sourceCount, windowHours, siteStats, onShowSources }: StatsCardsProps) {
  return (
    <div className="card p-3 sm:p-4 animate-fade-in">
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-2 sm:gap-x-6 sm:gap-y-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="p-1 sm:p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex-shrink-0">
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
          </div>
          <div className="text-label sm:text-label min-w-0">
            <span className="text-ink-secondary dark:text-ink-muted">{windowHours}h</span>
            <span className="mx-1 sm:mx-1.5 font-semibold text-ink dark:text-on-primary">{totalItems.toLocaleString()}</span>
            <span className="text-ink-secondary dark:text-ink-muted">条</span>
          </div>
        </div>

        <div className="hidden sm:block w-px h-4 bg-outline dark:bg-surface-variant-dark" />

        <button 
          onClick={() => {
            onShowSources()
          }}
          className="flex items-center gap-1.5 sm:gap-2 hover:opacity-70 transition-opacity">
          <div className="p-1 sm:p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex-shrink-0">
            <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
          </div>
          <div className="text-label sm:text-label min-w-0">
            <span className="font-semibold text-ink dark:text-on-primary">{siteStats.length}</span>
            <span className="mx-0.5 sm:mx-1 text-ink-secondary dark:text-ink-muted">平台</span>
            <span className="font-semibold text-ink dark:text-on-primary">{sourceCount}</span>
            <span className="mx-0.5 sm:mx-1 text-ink-secondary dark:text-ink-muted">源</span>
            <span className="hidden sm:inline ml-1 text-primary text-label">详情 →</span>
          </div>
        </button>

        <div className="hidden sm:block w-px h-4 bg-outline dark:bg-surface-variant-dark" />
      </div>
    </div>
  )
}
