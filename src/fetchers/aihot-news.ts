import type { RawItem } from '../types.js';
import { BaseFetcher } from './base.js';
import { fetchText } from '../utils/http.js';
import { parseDate } from '../utils/date.js';

const FEED_URL = 'https://aihot.news/feed.xml';

/** CDATA 或纯文本取值 */
function pickCdata(block: string, tag: string): string {
  const cdata = block.match(new RegExp(`<${tag}>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`));
  if (cdata) return cdata[1].trim();
  const plain = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return plain ? plain[1].trim() : '';
}

/**
 * 从 description 的 HTML 里取「阅读原文」链接。
 * AIHOT 每条摘要末尾都会附原文入口，站内链接（aihot.news）跳过。
 */
function extractOriginalUrl(description: string): string | null {
  const links = [...description.matchAll(/<a\s+href="([^"]+)"/g)].map((m) => m[1]);
  const external = links.find((href) => !/^https?:\/\/(www\.)?aihot\.news\//.test(href));
  return external || null;
}

/** x.com / twitter.com 需要登录且经常被墙，退回站内条目页 */
function isDeadEnd(url: string): boolean {
  return /^https?:\/\/(www\.)?(x|twitter)\.com\//.test(url);
}

export class AihotNewsFetcher extends BaseFetcher {
  siteId = 'aihot-news';
  siteName = 'AIHOT';

  async fetch(now: Date): Promise<RawItem[]> {
    const xml = await fetchText(FEED_URL, { timeout: 20000 });
    const blocks = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
    const items: RawItem[] = [];

    for (const block of blocks) {
      const title = pickCdata(block, 'title');
      const itemLink = pickCdata(block, 'link');
      if (!title || !itemLink) continue;

      const description = pickCdata(block, 'description');
      const originalUrl = extractOriginalUrl(description);
      const url = originalUrl && !isDeadEnd(originalUrl) ? originalUrl : itemLink;

      const publishedAt = parseDate(pickCdata(block, 'pubDate'), now);

      items.push(
        this.createItem({
          source: pickCdata(block, 'category') || 'AIHOT',
          title,
          url,
          publishedAt,
          meta: {
            item_url: itemLink,
            original_url: originalUrl,
            summary: description.replace(/<[^>]+>/g, '').slice(0, 200),
          },
        })
      );
    }

    return items;
  }
}
