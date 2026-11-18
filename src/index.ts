import { Command } from 'commander';
import { join, resolve } from 'path';
import pLimit from 'p-limit';

import type { RawItem, NewsItem, FetchStatus, SiteStat, LatestPayload, StatusPayload } from './types.js';
import { utcNow, toISOString, parseISO } from './utils/date.js';
import { normalizeUrl, getHost } from './utils/url.js';
import { maybeFixMojibake } from './utils/text.js';
import { makeItemId } from './utils/hash.js';
import { createAllFetchers, runFetcher } from './fetchers/index.js';
import { isAiRelated, dedupeItems } from './filters/index.js';
import { writeJson } from './output/index.js';

function eventTime(item: NewsItem): Date | null {
  return parseISO(item.published_at);
}

function normalizeSourceForDisplay(siteId: string, source: string, url: string): string {
  const src = (source || '').trim();
  if (!src) {
    let host = getHost(url);
    if (host.startsWith('www.')) host = host.slice(4);
    return host || '未分区';
  }
  return src;
}

async function main(): Promise<number> {
  const program = new Command();

  program
    .name('ai-news-aggregator')
    .description('Aggregate AI news updates from multiple sources')
    .option('--output-dir <dir>', 'Directory for output JSON files', 'data')
    .option('--window-hours <hours>', '24h window size', '24')
    .parse();

  const opts = program.opts();
  const outputDir = resolve(opts.outputDir);
  const windowHours = parseInt(opts.windowHours);

  const now = utcNow();

  const latest24hPath = join(outputDir, 'latest-24h.json');
  const latest7dPath = join(outputDir, 'latest-7d.json');
  const statusPath = join(outputDir, 'source-status.json');

  const fetchers = createAllFetchers();
  const limit = pLimit(5);

  console.log('');
  console.log('📡 Fetching from sources...');

  const fetchResults = await Promise.all(
    fetchers.map((f) => limit(() => runFetcher(f, now, true)))
  );

  const statuses: FetchStatus[] = [];
  const seen = new Map<string, NewsItem>();
  let droppedNoTime = 0;
  let droppedInvalid = 0;

  for (const { items, status } of fetchResults) {
    statuses.push(status);
    for (const raw of items as RawItem[]) {
      const title = (raw.title || '').trim();
      const url = normalizeUrl(raw.url);
      if (!title || !url || !url.startsWith('http')) {
        droppedInvalid++;
        continue;
      }

      // 没有发布时间的条目无法进入时间窗口，直接丢弃（当前所有源都提供时间）
      if (!raw.publishedAt) {
        droppedNoTime++;
        continue;
      }

      const id = makeItemId(raw.siteId, raw.source, title, url);
      if (seen.has(id)) continue;

      seen.set(id, {
        id,
        site_id: raw.siteId,
        site_name: raw.siteName,
        source: normalizeSourceForDisplay(raw.siteId, raw.source, url),
        title: maybeFixMojibake(title),
        url,
        published_at: toISOString(raw.publishedAt),
      });
    }
  }

  const allItems = Array.from(seen.values());
  console.log('');
  console.log(
    `📊 ${allItems.length} unique items from ${statuses.length} sources ` +
      `(dropped: ${droppedNoTime} no-time, ${droppedInvalid} invalid)`
  );

  function itemsInWindow(hours: number): NewsItem[] {
    const windowStart = new Date(now.getTime() - hours * 60 * 60 * 1000);
    return allItems
      .filter((item) => {
        const ts = eventTime(item);
        return ts !== null && ts >= windowStart;
      })
      .sort((a, b) => (eventTime(b)?.getTime() ?? 0) - (eventTime(a)?.getTime() ?? 0));
  }

  function buildPayload(items: NewsItem[], hours: number): LatestPayload {
    const siteStat = new Map<string, SiteStat>();
    for (const record of items) {
      const sid = record.site_id;
      if (!siteStat.has(sid)) {
        siteStat.set(sid, { site_id: sid, site_name: record.site_name, count: 0 });
      }
      siteStat.get(sid)!.count++;
    }

    return {
      generated_at: toISOString(now)!,
      window_hours: hours,
      total_items: items.length,
      site_count: siteStat.size,
      source_count: new Set(items.map((i) => `${i.site_id}::${i.source}`)).size,
      // 按名称字母序，大小写不敏感；中文（微信公众号）在 ICU 排序里天然排在拉丁字母之后
      site_stats: Array.from(siteStat.values()).sort((a, b) =>
        a.site_name.localeCompare(b.site_name, 'en', { sensitivity: 'base' })
      ),
      items,
    };
  }

  const items7dAll = itemsInWindow(168);
  const items7dAi = items7dAll.filter(isAiRelated);
  console.log(`🤖 7d AI-related items: ${items7dAi.length} / ${items7dAll.length}`);

  const windowStart24h = new Date(now.getTime() - windowHours * 60 * 60 * 1000);
  const items24hAi = items7dAi.filter((item) => {
    const ts = eventTime(item);
    return ts !== null && ts >= windowStart24h;
  });
  console.log(`🤖 24h AI-related items: ${items24hAi.length}`);

  const latest24hPayload = buildPayload(dedupeItems(items24hAi), windowHours);
  const latest7dPayload = buildPayload(dedupeItems(items7dAi), 168);

  const statusPayload: StatusPayload = {
    generated_at: toISOString(now)!,
    sites: statuses,
    successful_sites: statuses.filter((s) => s.ok).length,
    failed_sites: statuses.filter((s) => !s.ok).map((s) => s.site_id),
    zero_item_sites: statuses.filter((s) => s.ok && s.item_count === 0).map((s) => s.site_id),
    fetched_raw_items: statuses.reduce((n, s) => n + s.item_count, 0),
    items_before_topic_filter: items7dAll.length,
    items_in_24h: latest24hPayload.total_items,
  };

  console.log('');
  console.log('💾 Writing output files...');
  await writeJson(latest24hPath, latest24hPayload, true);
  await writeJson(latest7dPath, latest7dPayload, true);
  await writeJson(statusPath, statusPayload);

  console.log(`  ✅ ${latest24hPath} (${latest24hPayload.total_items} items)`);
  console.log(`  ✅ ${latest7dPath} (${latest7dPayload.total_items} items)`);
  console.log(`  ✅ ${statusPath}`);
  console.log('');
  console.log('🎉 Done!');

  return 0;
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
