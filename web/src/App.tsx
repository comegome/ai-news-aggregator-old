import { useState } from 'react'
import { Header } from './components/Header'
import { StatsCards } from './components/StatsCards'
import { FilterBar } from './components/FilterBar'
import { NewsList } from './components/NewsList'
import { SourceModal } from './components/SourceModal'
import { SwitchingOverlay } from './components/SwitchingOverlay'
import { useTheme } from './hooks/useTheme'
import { useNewsData } from './hooks/useNewsData'

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
    <div className="min-h-screen bg-surface-variant dark:bg-background-dark">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        generatedAt={data?.generated_at}
        windowHours={data?.window_hours}
        onShowSources={() => setShowSourceModal(true)}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        isSwitching={isSwitching}
      />

      {isSwitching && <SwitchingOverlay timeRange={timeRange} />}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <StatsCards
          totalItems={data?.total_items || 0}
          sourceCount={data?.source_count || 0}
          windowHours={data?.window_hours || 24}
          siteStats={siteStats}
          onShowSources={() => setShowSourceModal(true)}
        />

        <FilterBar
          siteStats={siteStats}
          sourceStats={sourceStats}
          selectedSite={selectedSite}
          onSiteChange={setSelectedSite}
          selectedSource={selectedSource}
          onSourceChange={setSelectedSource}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <NewsList
          items={filteredItems}
          loading={loading}
          error={error}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
      </main>

      <footer className="border-t border-outline dark:border-outline-dark py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-label text-ink-secondary dark:text-ink-muted">
            AI 资讯聚合 · 数据来源于多个 AI 资讯平台
          </p>
        </div>
      </footer>

      <SourceModal
        isOpen={showSourceModal}
        onClose={() => setShowSourceModal(false)}
        siteStats={siteStats}
        sourceCount={data?.source_count || 0}
        windowHours={data?.window_hours || 24}
      />
    </div>
  )
}

export default App
