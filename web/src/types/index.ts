export interface NewsItem {
  id: string
  site_id: string
  site_name: string
  source: string
  title: string
  url: string
  published_at: string | null
}

export interface SiteStat {
  site_id: string
  site_name: string
  count: number
}

export interface NewsData {
  generated_at: string
  window_hours: number
  total_items: number
  site_count: number
  source_count: number
  site_stats: SiteStat[]
  items: NewsItem[]
}

export interface SourceStatus {
  generated_at: string
  sites: SiteStatus[]
  successful_sites: number
  failed_sites: string[]
  zero_item_sites: string[]
  fetched_raw_items: number
  items_before_topic_filter: number
  items_in_24h: number
}

export interface SiteStatus {
  site_id: string
  site_name: string
  ok: boolean
  item_count: number
  duration_ms: number
  error: string | null
}
