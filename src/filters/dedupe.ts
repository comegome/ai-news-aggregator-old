import type { NewsItem } from '../types.js';
import { normalizeUrl } from '../utils/url.js';
import { parseISO } from '../utils/date.js';

function eventTime(item: NewsItem): Date | null {
  return parseISO(item.published_at);
}

/** 同一组里保留发布最早的一条（最接近原始出处），时间相同则按 id 稳定排序。 */
function pickEarliest(group: NewsItem[]): NewsItem {
  return group.reduce((best, current) => {
    const bt = eventTime(best);
    const ct = eventTime(current);
    if (!bt && !ct) return best.id <= current.id ? best : current;
    if (!bt) return current;
    if (!ct) return best;
    if (ct < bt) return current;
    if (ct > bt) return best;
    return best.id <= current.id ? best : current;
  });
}

/**
 * 两轮去重：
 *   1. 规范化 URL 相同 —— 同一条链接被多个聚合平台收录
 *   2. 标题相同 —— 转载、不同短链指向同一篇
 * 只保留发布最早的一条，并保证结果按发布时间倒序。
 */
export function dedupeItems(items: NewsItem[]): NewsItem[] {
  const byUrl = new Map<string, NewsItem[]>();
  for (const item of items) {
    const url = normalizeUrl(item.url || '');
    const key = url || `id::${item.id}`;
    if (!byUrl.has(key)) byUrl.set(key, []);
    byUrl.get(key)!.push(item);
  }

  const firstPass = Array.from(byUrl.values()).map(pickEarliest);

  const byTitle = new Map<string, NewsItem[]>();
  for (const item of firstPass) {
    const key = (item.title || '').toLowerCase().replace(/\s+/g, ' ').trim() || `id::${item.id}`;
    if (!byTitle.has(key)) byTitle.set(key, []);
    byTitle.get(key)!.push(item);
  }

  const result = Array.from(byTitle.values()).map(pickEarliest);

  result.sort((a, b) => {
    const timeA = eventTime(a)?.getTime() ?? 0;
    const timeB = eventTime(b)?.getTime() ?? 0;
    return timeB - timeA;
  });

  return result;
}
