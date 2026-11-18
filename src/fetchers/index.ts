export { BaseFetcher, runFetcher } from './base.js';
export { IrisFetcher } from './iris.js';
export { ZeliFetcher } from './zeli.js';
export { AiHotFetcher } from './aihot.js';
export { AiBaseFetcher } from './aibase.js';
export { WechatRssFetcher } from './wechat-rss.js';

import type { Fetcher } from '../types.js';
import { IrisFetcher } from './iris.js';
import { ZeliFetcher } from './zeli.js';
import { AiHotFetcher } from './aihot.js';
import { AiBaseFetcher } from './aibase.js';
import { WechatRssFetcher } from './wechat-rss.js';

/**
 * 四个聚合平台 + 公众号。
 * TechURLs 因不提供发布时间被移除；BestBlogs 上游接口返回 403，已停用。
 */
export function createAllFetchers(): Fetcher[] {
  return [
    new IrisFetcher(),
    new ZeliFetcher(),
    new AiHotFetcher(),
    new AiBaseFetcher(),
    new WechatRssFetcher(),
  ];
}
