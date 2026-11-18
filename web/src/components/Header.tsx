import { Sun, Moon, Bot, Clock, Info, Github, Loader2 } from 'lucide-react'
import { formatDateTime } from '../utils/formatDate'
import type { TimeRange } from '../hooks/useNewsData'

interface HeaderProps {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  generatedAt?: string | null
  windowHours?: number
  onShowSources?: () => void
  timeRange: TimeRange
  onTimeRangeChange: (range: TimeRange) => void
  isSwitching?: boolean
}

export function Header({
  theme,
  toggleTheme,
  generatedAt,
  windowHours,
  onShowSources,
  timeRange,
  onTimeRangeChange,
  isSwitching = false,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-surface/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-outline dark:border-outline-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              onClick={onShowSources}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity"title="数据来源">
              <Bot className="w-5 h-5 text-on-primary" />
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={onShowSources}
                  className="group flex items-center gap-1.5 hover:opacity-75 transition-opacity">
                  <h1 className="text-headline text-ink dark:text-ink-dark whitespace-nowrap">
                    AI 资讯聚合
                  </h1>
                  <Info className="w-4 h-4 text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" />
                </button>

                <div className="flex items-center bg-surface-variant dark:bg-surface-variant-dark rounded-full p-1">
                  {(['24h', '7d'] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => onTimeRangeChange(range)}
                      disabled={isSwitching}
                      className={`px-3 py-1 text-label rounded-full transition-colors flex items-center gap-1.5 ${
                        timeRange === range
                          ? 'bg-primary text-on-primary'
                          : 'text-ink-secondary dark:text-ink-muted hover:text-ink dark:hover:text-ink-dark'
                      } ${isSwitching ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSwitching && timeRange === range && (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      )}
                      {range === '24h' ? '24 小时' : '7 天'}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-label text-ink-secondary dark:text-ink-muted hidden sm:block mt-0.5">
                实时追踪 AI 领域最新动态
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {generatedAt && (
              <div className="hidden lg:flex items-center gap-1.5 text-label text-ink-secondary dark:text-ink-muted mr-2">
                <Clock className="w-4 h-4" />
                <span>更新于 {formatDateTime(generatedAt)}</span>
                {windowHours && (
                  <span className="text-ink-muted">· {windowHours}h</span>
                )}
              </div>
            )}

            <a
              href="https://github.com/comegome/ai-news-aggregator"target="_blank"rel="noopener noreferrer"className="p-2 rounded-full text-ink-secondary dark:text-ink-muted hover:bg-surface-variant dark:hover:bg-surface-variant-dark transition-colors"title="GitHub">
              <Github className="w-5 h-5" />
            </a>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-ink-secondary dark:text-ink-muted hover:bg-surface-variant dark:hover:bg-surface-variant-dark transition-colors"title={theme === 'light' ? '切换深色模式' : '切换浅色模式'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
