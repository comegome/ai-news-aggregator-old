import { BADGE_COLOR } from '../utils/constants'

interface SourceBadgeProps {
  siteId: string
  siteName: string
}

export function SourceBadge({ siteName }: SourceBadgeProps) {
  return <span className={`badge ${BADGE_COLOR}`}>{siteName}</span>
}
