import type { RawItem } from '../types.js';
import { BaseFetcher } from './base.js';
import { fetchText } from '../utils/http.js';
import pLimit from 'p-limit';

interface WechatFeed {
  name: string;
  url: string;
  category: string;
}

const WECHAT_FEEDS: WechatFeed[] = [
  { name: '机器之心', url: 'https://decemberpei.cyou/rssbox/wechat-jiqizhixin.xml', category: 'AI' },
  { name: '量子位', url: 'https://decemberpei.cyou/rssbox/wechat-liangziwei.xml', category: 'AI' },
  { name: '新智元', url: 'https://decemberpei.cyou/rssbox/wechat-xinzhiyuan.xml', category: 'AI' },
  { name: 'DeepTech深科技', url: 'https://decemberpei.cyou/rssbox/wechat-shenkeji.xml', category: 'AI' },
  { name: 'PaperWeekly', url: 'https://decemberpei.cyou/rssbox/wechat-paperweekly.xml', category: 'AI' },
  { name: 'AI前线', url: 'https://decemberpei.cyou/rssbox/wechat-aiqianxian.xml', category: 'AI' },
  { name: '36氪', url: 'https://decemberpei.cyou/rssbox/wechat-36ke.xml', category: '科技媒体' },
  { name: '晚点LatePost', url: 'https://decemberpei.cyou/rssbox/wechat-wandian.xml', category: '科技媒体' },
  { name: '极客公园', url: 'https://decemberpei.cyou/rssbox/wechat-jikegongyuan.xml', category: '科技媒体' },
  { name: '少数派', url: 'https://decemberpei.cyou/rssbox/wechat-shaoshupai.xml', category: '科技媒体' },
  { name: '爱范儿', url: 'https://decemberpei.cyou/rssbox/wechat-anfaner.xml', category: '科技媒体' },
  { name: '虎嗅App', url: 'https://decemberpei.cyou/rssbox/wechat-huxiuapp.xml', category: '科技媒体' },
  { name: 'GitHubDaily', url: 'https://decemberpei.cyou/rssbox/wechat-githubdaily.xml', category: '技术开发' },
  { name: 'InfoQ', url: 'https://decemberpei.cyou/rssbox/wechat-infoq.xml', category: '技术开发' },
];

interface ParsedArticle {
  title: string;
  url: string;
  description: string;
}

interface ParsedFeed {
  channelTitle: string;
  lastBuildDate: Date | null;
  articles: ParsedArticle[];
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function parseWechatRss(xml: string): ParsedFeed {
  const channelTitleMatch = xml.match(/<channel>[\s\S]*?<title>([^<]+)<\/title>/);
  const lastBuildDateMatch = xml.match(/<lastBuildDate>([^<]+)<\/lastBuildDate>/);

  const channelTitle = channelTitleMatch
    ? decodeHtmlEntities(channelTitleMatch[1])
    : '';
  const lastBuildDate = lastBuildDateMatch
    ? new Date(lastBuildDateMatch[1])
    : null;

  const articles: ParsedArticle[] = [];
  const itemMatches = xml.matchAll(/<item>[\s\S]*?<\/item>/g);

  for (const match of itemMatches) {
    const item = match[0];

    const titleMatch = item.match(/<title>([^<]+)<\/title>/);
    const linkMatch = item.match(/<link>([^<]+)<\/link>/);
    const descMatch = item.match(/<description>([^<]*)<\/description>/);

    if (titleMatch && linkMatch) {
      articles.push({
        title: decodeHtmlEntities(titleMatch[1]),
        url: decodeHtmlEntities(linkMatch[1]),
        description: descMatch ? decodeHtmlEntities(descMatch[1]) : '',
      });
    }
  }

  return { channelTitle, lastBuildDate, articles };
}

export class WechatRssFetcher extends BaseFetcher {
  siteId = 'wechat-rss';
  siteName = '微信公众号';

  async fetch(_now: Date): Promise<RawItem[]> {
    const limit = pLimit(10);
    const items: RawItem[] = [];

    const results = await Promise.all(
      WECHAT_FEEDS.map((feed) =>
        limit(async () => {
          try {
            const xml = await fetchText(feed.url, { timeout: 15000 });
            const parsed = parseWechatRss(xml);
            return { feed, parsed };
          } catch {
            return { feed, parsed: null };
          }
        })
      )
    );

    for (const { feed, parsed } of results) {
      if (!parsed) continue;

      const sourceName = feed.name || parsed.channelTitle.replace('微信公众号-', '');

      for (const article of parsed.articles) {
        items.push(
          this.createItem({
            source: sourceName,
            title: article.title,
            url: article.url,
            publishedAt: parsed.lastBuildDate,
            meta: {
              category: feed.category,
              description: article.description.slice(0, 200),
            },
          })
        );
      }
    }

    return items;
  }
}

export { WECHAT_FEEDS };
