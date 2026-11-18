export { BaseFetcher, runFetcher } from './base.js';
export { IrisFetcher } from './iris.js';
export { ZeliFetcher } from './zeli.js';
export { AihotNewsFetcher } from './aihot-news.js';
export { AiBaseFetcher } from './aibase.js';
export { WechatRssFetcher } from './wechat-rss.js';

import type { Fetcher } from '../types.js';
import { IrisFetcher } from './iris.js';
import { ZeliFetcher } from './zeli.js';
import { AihotNewsFetcher } from './aihot-news.js';
import { AiBaseFetcher } from './aibase.js';
import { WechatRssFetcher } from './wechat-rss.js';

/**
 * 四个聚合平台 + 公众号。
 * TechURLs 无发布时间、BestBlogs 返回 403、AI今日热榜（aihot.today）在 GitHub Actions
 * 的 Azure IP 上被 Cloudflare 拦截，三者均已移除。
 */
export function createAllFetchers(): Fetcher[] {
  return [
    new IrisFetcher(),
    new ZeliFetcher(),
    new AihotNewsFetcher(),
    new AiBaseFetcher(),
    new WechatRssFetcher(),
  ];
}
