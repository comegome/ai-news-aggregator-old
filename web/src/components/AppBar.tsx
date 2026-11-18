import { Search, Sun, Moon, Info, X } from 'lucide-react'

interface AppBarProps {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  searchQuery: string
  onSearchChange: (q: string) => void
  onShowSources: () => void
}

export function AppBar({ theme, toggleTheme, searchQuery, onSearchChange, onShowSources }: AppBarProps) {
  const searchField = (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-muted" />
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="搜索标题或来源"
        className="search-field"
        aria-label="搜索资讯"
      />
      {searchQuery && (
        <button
          onClick={() => onSearchChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ink-muted hover:bg-hairline/50 dark:hover:bg-hairline-dark/50"
          title="清空"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-surface/95 backdrop-blur-md dark:border-hairline-dark dark:bg-surface-dark/95">
      <div className="mx-auto max-w-3xl px-4">
        <div className="flex h-16 items-center gap-3">
          <a href="./" className="shrink-0 select-none" aria-label="AGIgregator 首页">
            <h1 className="m-0 text-wordmark">
              <span className="font-medium text-primary dark:text-primary-dark">AGI</span>
              <span className="font-normal text-ink dark:text-ink-dark">gregator</span>
            </h1>
          </a>

          <div className="ml-2 hidden min-w-0 flex-1 sm:block">{searchField}</div>

          <div className="ml-auto flex items-center gap-0.5 sm:ml-0">
            <button onClick={onShowSources} className="icon-button" title="数据来源">
              <Info className="h-5 w-5" />
            </button>
            <button
              onClick={toggleTheme}
              className="icon-button"
              title={theme === 'light' ? '切换深色模式' : '切换浅色模式'}
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="pb-3 sm:hidden">{searchField}</div>
      </div>
    </header>
  )
}
