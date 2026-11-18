import { X, Globe, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react'
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
  successful_sites: number
  failed_sites: string[]
  fetched_raw_items: number
}

const SITE_INFO: Record<string, { description: string; url: string }> = {
  iris: {
    description: 'Info Flow 信息流，聚合 Hacker News、V2EX、少数派、IT之家等 12 个技术社区的 RSS',
    url: 'https://iris.findtruman.io/web/info_flow',
  },
  zeli: {
    description: 'Hacker News 24 小时最热榜，带准确发布时间',
    url: 'https://zeli.app/',
  },
  aihot: {
    description: 'AI 今日热榜，聚合 arXiv、Anthropic、Hugging Face、Google Research 等 20 个 AI 一手来源',
    url: 'https://aihot.today/',
  },
  'aihot-news': {
    description: 'AIHOT 由数字生命卡兹克出品，每天精选 AI 行业动态、模型发布、产品与论文，RSS 保留 50 条',
    url: 'https://aihot.news/',
  },
  aibase: {
    description: 'AIbase 中文 AI 资讯，覆盖大模型发布与产业动态',
    url: 'https://www.aibase.com/zh/news',
  },
  'wechat-rss': {
    description: '微信公众号 RSS，仅保留 AI、科技媒体与技术社区共 14 个账号',
    url: '',
  },
}

export function SourceModal({ isOpen, onClose, siteStats, sourceCount, windowHours }: SourceModalProps) {
  const [sourceStatus, setSourceStatus] = useState<SourceStatus | null>(null)

  useEffect(() => {
    if (!isOpen) return
    const basePath = import.meta.env.BASE_URL || '/'
    fetch(`${basePath}data/source-status.json`)
      .then((res) => res.json())
      .then((data) => setSourceStatus(data))
      .catch(() => {})
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const totalFilteredItems = siteStats.reduce((sum, s) => sum + s.count, 0)

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-surface dark:bg-surface-dark rounded-lg border border-outline dark:border-outline-dark overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline dark:border-outline-dark">
          <h2 className="text-headline text-ink dark:text-ink-dark">数据来源</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-ink-secondary dark:text-ink-muted hover:bg-surface-variant dark:hover:bg-surface-variant-dark transition-colors"
            title="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 overflow-y-auto max-h-[calc(85vh-80px)]">
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-surface-variant dark:bg-surface-variant-dark rounded-lg p-4 text-center">
              <p className="text-headline text-ink dark:text-ink-dark">{siteStats.length}</p>
              <p className="text-label text-ink-secondary dark:text-ink-muted mt-1">数据平台</p>
            </div>
            <div className="bg-surface-variant dark:bg-surface-variant-dark rounded-lg p-4 text-center">
              <p className="text-headline text-ink dark:text-ink-dark">{sourceCount}</p>
              <p className="text-label text-ink-secondary dark:text-ink-muted mt-1">订阅源</p>
            </div>
            <div className="bg-surface-variant dark:bg-surface-variant-dark rounded-lg p-4 text-center">
              <p className="text-headline text-primary dark:text-primary-dark">
                {totalFilteredItems.toLocaleString()}
              </p>
              <p className="text-label text-ink-secondary dark:text-ink-muted mt-1">AI 资讯</p>
            </div>
          </div>

          <div className="bg-surface-variant dark:bg-surface-variant-dark rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-label text-ink-secondary dark:text-ink-muted">
              <Clock className="w-4 h-4" />
              <span>
                最近 <strong className="text-ink dark:text-ink-dark">{windowHours} 小时</strong> 内，
                从 <strong className="text-ink dark:text-ink-dark">{sourceStatus?.fetched_raw_items ?? '-'}</strong> 条原始资讯中
                筛选出 <strong className="text-ink dark:text-ink-dark">{totalFilteredItems.toLocaleString()}</strong> 条 AI 相关内容
              </span>
            </div>
          </div>

          <h3 className="text-label font-medium text-ink dark:text-ink-dark mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            数据平台详情
          </h3>

          <div className="space-y-3">
            {siteStats.map((stat) => {
              const siteInfo = sourceStatus?.sites.find((s) => s.site_id === stat.site_id)
              const isOk = siteInfo?.ok !== false
              const info = SITE_INFO[stat.site_id]

              return (
                <div
                  key={stat.site_id}
                  className="rounded-lg border border-outline dark:border-outline-dark overflow-hidden"
                >
                  <div className="flex items-center justify-between p-3 bg-surface dark:bg-surface-variant-dark/50">
                    <div className="flex items-center gap-3">
                      {isOk ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                      )}
                      <span className="text-title text-ink dark:text-ink-dark">{stat.site_name}</span>
                    </div>
                    <span className="text-label text-primary dark:text-primary-dark font-medium">
                      {stat.count} 条
                    </span>
                  </div>

                  {info && (
                    <div className="px-4 pb-4 pt-3 bg-surface-variant dark:bg-surface-dark/50 border-t border-outline dark:border-outline-dark">
                      <p className="text-label text-ink-secondary dark:text-ink-muted mb-1">
                        {info.description}
                      </p>
                      {info.url && (
                        <a
                          href={info.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-label text-primary dark:text-primary-dark hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {info.url}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
