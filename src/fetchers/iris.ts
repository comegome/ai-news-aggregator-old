import Parser from 'rss-parser';
import pLimit from 'p-limit';
import type { RawItem } from '../types.js';
import { BaseFetcher } from './base.js';
import { fetchText } from '../utils/http.js';
import { parseDate } from '../utils/date.js';
import { firstNonEmpty } from '../utils/text.js';

/**
 * Info Flow：从页面里扒出 feeds 数组，再逐个拉 RSS。
 * 原来 12 个 feed 串行 await，单轮 50s+；改为 8 路并发后约 5s。
 */
export class IrisFetcher extends BaseFetcher {
  siteId = 'iris';
  siteName = 'Info Flow';

  async fetch(now: Date): Promise<RawItem[]> {
    const html = await fetchText('https://iris.findtruman.io/web/info_flow');

    const feedMatch = html.match(/const\s+feeds\s*=\s*\[(.*?)\]\s*;/s);
    if (!feedMatch) return [];

    const feedSection = feedMatch[1];
    const feedRegex = /\{\s*name:\s*'([^']+)'\s*,\s*url:\s*'([^']+)'\s*\}/g;
    const feeds: Array<{ name: string; url: string }> = [];

    let match;
    while ((match = feedRegex.exec(feedSection)) !== null) {
      feeds.push({ name: match[1], url: match[2] });
    }

    const parser = new Parser();
    const limit = pLimit(8);

    const results = await Promise.all(
      feeds.map((feed) =>
        limit(async () => {
          try {
            // retries: 0 —— 单个 feed 挂掉不该拖累整轮；超时硬截断在 8s
            const xml = await fetchText(feed.url, { timeout: 8000, retries: 0 });
            const parsed = await parser.parseString(xml);
            return { feed, parsed };
          } catch {
            return { feed, parsed: null };
          }
        })
      )
    );

    const items: RawItem[] = [];

    for (const { feed, parsed } of results) {
      if (!parsed) continue;

      const sourceName = firstNonEmpty(feed.name, parsed.title, 'Iris Feed');

      for (const entry of parsed.items || []) {
        const title = (entry.title || '').trim();
        const url = (entry.link || '').trim();
        if (!title || !url) continue;

        const publishedAt =
          parseDate(entry.pubDate, now) ||
          parseDate(entry.isoDate, now) ||
          null;

        items.push(
          this.createItem({
            source: sourceName,
            title,
            url,
            publishedAt,
            meta: { feed_url: feed.url },
          })
        );
      }
    }

    return items;
  }
}
