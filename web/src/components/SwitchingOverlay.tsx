import { Loader2 } from 'lucide-react'
import type { TimeRange } from '../hooks/useNewsData'

interface SwitchingOverlayProps {
  timeRange: TimeRange
}

export function SwitchingOverlay({ timeRange }: SwitchingOverlayProps) {
  const label = timeRange === '24h' ? '24 小时' : '7 天'
  
  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div className="flex items-center gap-2 bg-surface dark:bg-surface-dark px-4 py-2.5 rounded-full  border border-outline dark:border-outline-dark">
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
          <span className="text-label text-ink-secondary dark:text-ink-dark">
            正在加载{label}数据...
          </span>
        </div>
      </div>
    </div>
  )
}
