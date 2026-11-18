import { X, CheckCircle2, XCircle, ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { SiteStat } from '../types'

interface SourceModalProps {
  isOpen: boolean
  onClose: () => void
  siteStats: SiteStat[]
  sourceCount: number
  windowHours: number
}

interface SourceStatus {
  generated_at: string
  sites: {
    site_id: string
    site_name: string
    ok: boolean
    item_count: number
    duration_ms: number
    error: string | null
  }[]
  fetched_raw_items: number
}

const SITE_INFO: Record<string, { description: string; url: string }> = {
  iris: {
    description: '聚合 Hacker News、V2EX、少数派、IT之家等 12 个技术社区的 RSS 信息流',
    url: 'https://iris.findtruman.io/web/info_flow',
  },
  zeli: {
    description: 'Hacker News 24 小时最热榜，带准确发布时间',
    url: 'https://zeli.app/',
  },
  'aihot-news': {
    description: '数字生命卡兹克出品的 AI 精选，每天 50 条，含原文链接',
    url: 'https://aihot.news/',
  },
  aibase: {
    description: '中文 AI 资讯，覆盖大模型发布与产业动态',
    url: 'https://www.aibase.com/zh/news',
  },
  'wechat-rss': {
    description: '微信公众号 RSS，仅保留 AI、科技媒体与技术社区共 14 个账号',
    url: '',
  },
}

export function SourceModal({ isOpen, onClose, siteStats, sourceCount, windowHours }: SourceModalProps) {
  const [status, setStatus] = useState<SourceStatus | null>(null)

  useEffect(() => {
    if (!isOpen) return
    const base = import.meta.env.BASE_URL || '/'
    fetch(`${base}data/source-status.json`)
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => {})
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const total = siteStats.reduce((sum, s) => sum + s.count, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/32 animate-fade-in" onClick={onClose} />

      <div className="relative flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[28px] bg-surface shadow-modal animate-slide-up dark:bg-surface-dark sm:rounded-[28px]">
        <div className="flex items-start justify-between px-6 pb-2 pt-6">
          <div>
            <h2 className="text-wordmark text-ink dark:text-ink-dark">数据来源</h2>
            <p className="mt-1 text-meta text-ink-secondary dark:text-ink-dark-secondary">
              最近 {windowHours} 小时 · 从 {status?.fetched_raw_items ?? '—'} 条原始资讯筛选出 {total.toLocaleString()} 条
            </p>
          </div>
          <button onClick={onClose} className="icon-button -mr-2 -mt-1" title="关闭">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 pb-6">
          {siteStats.map((stat) => {
            const info = SITE_INFO[stat.site_id]
            const site = status?.sites.find((s) => s.site_id === stat.site_id)
            const ok = site?.ok !== false

            return (
              <div
                key={stat.site_id}
                className="border-t border-hairline py-4 first:border-t-0 dark:border-hairline-dark"
              >
                <div className="flex items-center gap-2">
                  {ok ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary dark:text-primary-dark" strokeWidth={1.8} />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" strokeWidth={1.8} />
                  )}
                  <span className="text-title text-ink dark:text-ink-dark">{stat.site_name}</span>
                  <span className="ml-auto text-meta text-ink-secondary dark:text-ink-dark-secondary">
                    {stat.count} 条
                  </span>
                </div>

                {info && (
                  <p className="mt-1.5 pl-6 text-meta leading-relaxed text-ink-secondary dark:text-ink-dark-secondary">
                    {info.description}
                  </p>
                )}

                {info?.url && (
                  <a
                    href={info.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 pl-6 text-meta text-primary hover:underline dark:text-primary-dark"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {info.url.replace(/^https?:\/\//, '')}
                  </a>
                )}

                {site && !site.ok && site.error && (
                  <p className="mt-1 pl-6 text-meta text-red-600 dark:text-red-400">{site.error}</p>
                )}
              </div>
            )
          })}

          <p className="border-t border-hairline pt-4 text-meta text-ink-muted dark:border-hairline-dark">
            共 {sourceCount} 个订阅源，每 2 小时抓取一次。
          </p>
        </div>
      </div>
    </div>
  )
}
