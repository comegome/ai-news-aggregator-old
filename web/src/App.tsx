import { useState } from 'react'
import { AppBar } from './components/AppBar'
import { FilterBar } from './components/FilterBar'
import { NewsList } from './components/NewsList'
import { SourceModal } from './components/SourceModal'
import { useTheme } from './hooks/useTheme'
import { useNewsData } from './hooks/useNewsData'
import { formatDateTime } from './utils/formatDate'

function App() {
  const { theme, toggleTheme } = useTheme()
  const [showSourceModal, setShowSourceModal] = useState(false)

  const {
    data,
    loading,
    error,
    filteredItems,
    siteStats,
    sourceStats,
    searchQuery,
    setSearchQuery,
    selectedSite,
    setSelectedSite,
    selectedSource,
    setSelectedSource,
    loadMore,
    hasMore,
    timeRange,
    setTimeRange,
    isSwitching,
  } = useNewsData()

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark">
      <AppBar
        theme={theme}
        toggleTheme={toggleTheme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onShowSources={() => setShowSourceModal(true)}
      />

      <main className="mx-auto max-w-3xl px-4 pt-2">
        <FilterBar
          siteStats={siteStats}
          sourceStats={sourceStats}
          selectedSite={selectedSite}
          onSiteChange={setSelectedSite}
          selectedSource={selectedSource}
          onSourceChange={setSelectedSource}
          totalItems={data?.total_items ?? 0}
          sourceCount={data?.source_count ?? 0}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          isSwitching={isSwitching}
        />

        <NewsList
          items={filteredItems}
          loading={loading}
          error={error}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
      </main>

      <footer className="border-t border-hairline dark:border-hairline-dark">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-meta text-ink-muted">
          <span>
            <span className="text-primary dark:text-primary-dark">AGI</span>gregator
          </span>
          <span>
            {data?.generated_at ? `更新于 ${formatDateTime(data.generated_at)} · 每 2 小时` : '数据加载中'}
          </span>
        </div>
      </footer>

      <SourceModal
        isOpen={showSourceModal}
        onClose={() => setShowSourceModal(false)}
        siteStats={siteStats}
        sourceCount={data?.source_count ?? 0}
        windowHours={data?.window_hours ?? 24}
      />
    </div>
  )
}

export default App
