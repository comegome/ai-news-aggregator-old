#!/usr/bin/env python3
"""把 SPA 的构建产物做成「爬虫可见」的页面。

Vite 打出来的是一个空 <div id="root">，百度、Bing 这类不执行 JS 的爬虫看到的是空白页。
这个脚本在构建产物上做三件事：

  1. 往 index.html 里注入 title/description/canonical/OG/Twitter 和 JSON-LD
  2. 把最新 N 条资讯渲染成静态 HTML 放进 #root（React 挂载时会整体替换）
  3. 生成 sitemap.xml 与 robots.txt

用法：
  python3 scripts/prerender.py --dist web/dist --data data \
      --site https://agigregator.yuzhaizu.com --base /

GitHub Pages 用 --site https://comegome.github.io/ai-news-aggregator --base /ai-news-aggregator/
"""

from __future__ import annotations

import argparse
import html
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

MAX_ITEMS = 30

META_BLOCK = "<!-- SEO_META -->"
PRERENDER_BLOCK = "<!-- PRERENDER -->"


def esc(text: str) -> str:
    return html.escape(text or "", quote=True)


def load_json(path: Path) -> dict:
    with path.open(encoding="utf-8") as fh:
        return json.load(fh)


def parse_time(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def relative_time(published: datetime | None, now: datetime) -> str:
    if not published:
        return ""
    delta = (now - published).total_seconds()
    if delta < 0:
        return "刚刚"
    if delta < 3600:
        return f"{max(1, int(delta // 60))} 分钟前"
    if delta < 86400:
        return f"{int(delta // 3600)} 小时前"
    days = int(delta // 86400)
    return f"{days} 天前" if days < 8 else published.strftime("%m-%d")


def build_meta(data: dict, site: str, base: str, noindex: bool = False, canonical: str | None = None) -> str:
    sites = "、".join(s["site_name"] for s in data.get("site_stats", [])[:5])
    total = data.get("total_items", 0)
    hours = data.get("window_hours", 24)
    desc = (
        f"AI 资讯聚合：最近 {hours} 小时 {total} 条 AI 与科技资讯，来自 {sites} 等平台，"
        "每 2 小时自动更新，支持按平台、来源筛选与关键词搜索。"
    )
    url = site.rstrip("/") + "/"
    canon = canonical or url
    og_image = url + "og.png"
    title = "AGIgregator — AI 资讯聚合"
    robots = "noindex,follow" if noindex else "index,follow,max-image-preview:large"
    return "\n".join(
        [
            f'<meta name="robots" content="{robots}" />',
            f'<meta name="description" content="{esc(desc)}" />',
            f'<link rel="canonical" href="{esc(canon)}" />',
            f'<meta property="og:type" content="website" />',
            f'<meta property="og:site_name" content="AGIgregator" />',
            f'<meta property="og:locale" content="zh_CN" />',
            f'<meta property="og:title" content="{esc(title)}" />',
            f'<meta property="og:description" content="{esc(desc)}" />',
            f'<meta property="og:url" content="{esc(url)}" />',
            f'<meta property="og:image" content="{esc(og_image)}" />',
            f'<meta property="og:image:width" content="1200" />',
            f'<meta property="og:image:height" content="630" />',
            f'<meta name="twitter:card" content="summary_large_image" />',
            f'<meta name="twitter:title" content="{esc(title)}" />',
            f'<meta name="twitter:description" content="{esc(desc)}" />',
            f'<meta name="twitter:image" content="{esc(og_image)}" />',
        ]
    )


def build_jsonld(data: dict, site: str) -> str:
    url = site.rstrip("/") + "/"
    items = data.get("items", [])[:MAX_ITEMS]
    list_items = []
    for idx, item in enumerate(items, start=1):
        entry = {
            "@type": "ListItem",
            "position": idx,
            "name": item.get("title", ""),
            "url": item.get("url", ""),
        }
        if item.get("published_at"):
            entry["datePublished"] = item["published_at"]
        list_items.append(entry)

    graph = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": url + "#website",
                "url": url,
                "name": "AGIgregator",
                "alternateName": "AI 资讯聚合",
                "description": "每 2 小时更新的 AI 与科技资讯聚合阅读器",
                "inLanguage": "zh-CN",
                "publisher": {"@type": "Organization", "name": "AGIgregator", "url": url},
            },
            {
                "@type": "ItemList",
                "@id": url + "#latest",
                "name": "最新 AI 资讯",
                "numberOfItems": len(list_items),
                "itemListElement": list_items,
            },
        ],
    }
    payload = json.dumps(graph, ensure_ascii=False, separators=(",", ":"))
    return f'<script type="application/ld+json">{payload}</script>'


def build_static_body(data: dict, base: str) -> str:
    now = datetime.now(timezone.utc)
    generated = parse_time(data.get("generated_at")) or now
    stats = data.get("site_stats", [])
    total = data.get("total_items", 0)
    hours = data.get("window_hours", 24)
    site_count = len(stats)
    source_count = data.get("source_count", 0)

    rows = []
    for item in data.get("items", [])[:MAX_ITEMS]:
        when = relative_time(parse_time(item.get("published_at")), now)
        src = " · ".join(x for x in (item.get("site_name", ""), when) if x)
        rows.append(
            "      <li>\n"
            f'        <span class="src">{esc(src)}</span>\n'
            f'        <a href="{esc(item.get("url", ""))}" rel="noopener">{esc(item.get("title", ""))}</a>\n'
            "      </li>"
        )

    platforms = "、".join(s["site_name"] for s in stats)
    return (
        '<div class="ssr">\n'
        '  <header>\n'
        '    <h1><span class="accent">AGI</span>gregator</h1>\n'
        f'    <p class="ssr-meta">{esc(generated.strftime("%Y-%m-%d %H:%M"))} 更新 · '
        f"{total} 条 · {site_count} 个平台 · {source_count} 个源 · 最近 {hours} 小时</p>\n"
        "  </header>\n"
        f"  <p class=\"ssr-meta\">平台：{esc(platforms)}</p>\n"
        "  <ul>\n" + "\n".join(rows) + "\n  </ul>\n"
        f'  <p class="more">共 {total} 条，完整列表与筛选功能请启用 JavaScript。</p>\n'
        "</div>"
    )


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dist", required=True, help="构建产物目录")
    ap.add_argument("--data", required=True, help="data/*.json 所在目录")
    ap.add_argument("--site", required=True, help="站点根 URL，例如 https://example.com")
    ap.add_argument("--base", default="/", help="部署路径前缀，默认 /")
    ap.add_argument(
        "--noindex",
        action="store_true",
        help="标记 noindex,follow 并不再生成 sitemap（用于镜像站，把权重让给主站）",
    )
    ap.add_argument(
        "--canonical",
        default=None,
        help="canonical 指向的 URL，默认指向 --site 自身",
    )
    args = ap.parse_args()

    dist = Path(args.dist)
    data_dir = Path(args.data)
    index = dist / "index.html"
    if not index.exists():
        print(f"找不到 {index}", file=sys.stderr)
        return 1

    latest = load_json(data_dir / "latest-24h.json")

    # 首次运行时把未注入的 index.html 存成模板；之后一律从模板重建，
    # 保证重复执行结果一致（直接读 index.html 会把已注入内容再包一层）
    template = dist / "index.template.html"
    if template.exists():
        html_text = template.read_text(encoding="utf-8")
    else:
        html_text = index.read_text(encoding="utf-8")
        template.write_text(html_text, encoding="utf-8")

    if META_BLOCK not in html_text or PRERENDER_BLOCK not in html_text:
        print("index.html 缺少 SEO_META / PRERENDER 占位标记", file=sys.stderr)
        return 1

    meta = build_meta(latest, args.site, args.base, args.noindex, args.canonical)
    jsonld = build_jsonld(latest, args.site)
    body = build_static_body(latest, args.base)

    html_text = html_text.replace(META_BLOCK, meta + "\n    " + jsonld, 1)
    html_text = html_text.replace(PRERENDER_BLOCK, body, 1)

    index.write_text(html_text, encoding="utf-8")

    generated = parse_time(latest.get("generated_at")) or datetime.now(timezone.utc)

    if args.noindex:
        # 镜像站：不交 sitemap（交一个 noindex 的 URL 只会在 GSC 里堆「已排除」），
        # 但 robots 仍允许抓取，否则爬虫看不到页面上的 noindex 标签
        stale = dist / "sitemap.xml"
        if stale.exists():
            stale.unlink()
        robots = "User-agent: *\nAllow: /\nDisallow: /assets/\n"
    else:
        sitemap = (
            '<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
            f"  <url>\n    <loc>{esc(args.site.rstrip('/'))}/</loc>\n"
            f"    <lastmod>{generated.strftime('%Y-%m-%dT%H:%M:%S+00:00')}</lastmod>\n"
            "    <changefreq>hourly</changefreq>\n    <priority>1.0</priority>\n  </url>\n"
            "</urlset>\n"
        )
        (dist / "sitemap.xml").write_text(sitemap, encoding="utf-8")
        robots = (
            "User-agent: *\n"
            "Allow: /\n"
            "Disallow: /assets/\n"
            "\n"
            f"Sitemap: {args.site.rstrip('/')}/sitemap.xml\n"
        )

    (dist / "robots.txt").write_text(robots, encoding="utf-8")

    print(f"预渲染完成：{len(latest.get('items', [])[:MAX_ITEMS])} 条 / sitemap + robots 已生成")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
