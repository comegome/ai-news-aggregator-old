<div align="center">

# 🤖 AI News Aggregator

**实时追踪 AI 领域最前沿动态，聚合全球顶级 AI 资讯源**

[![GitHub Actions](https://img.shields.io/github/actions/workflow/status/SuYxh/ai-news-aggregator/update-ai-news.yml?label=auto%20update&logo=github)](https://github.com/SuYxh/ai-news-aggregator/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org/)

[🌐 在线预览](https://comegome.github.io/ai-news-aggregator/) · [📝 更新日志](./CHANGELOG.md) · [🔧 技术方案](./TECH_SPEC.md)

</div>

---

## ✨ 项目亮点

<table>
<tr>
<td width="50%">

### 📡 多源聚合
从 **5 个专业平台** + **14 个微信公众号** 实时抓取资讯，覆盖全球 AI 生态

### 🧠 智能筛选
基于关键词匹配的 AI 相关性过滤，从海量信息中精准提取 AI/科技内容

### 🧹 轻量存储
产物只保留 24h / 7d 两个窗口，不写存档、不做翻译，仓库不再膨胀

</td>
<td width="50%">

### ⚡ 自动更新
GitHub Actions 每 2 小时自动抓取，数据永远保持最新

### 🎨 Web 可视化
内置 React + TypeScript Web 应用，支持多维度筛选、搜索、暗色模式

### 📦 结构化数据
输出标准 JSON 格式，方便二次开发和数据分析

</td>
</tr>
</table>

---

## 🖼️ 界面预览

<div align="center">

### 📰 首页资讯流

<img src="./assets/home.jpeg" alt="首页" width="800" />

<br />

</div>

---

## 🌐 在线预览

访问 [https://comegome.github.io/ai-news-aggregator/](https://comegome.github.io/ai-news-aggregator/) 查看实时 AI 资讯聚合。

**功能特性：**
- 📱 响应式设计，支持移动端
- 🔍 按平台、订阅源筛选
- 🔎 标题关键词搜索
- 🌙 浅色/深色主题切换
- ⏱️ 24h/7d 时间范围切换
- 🚀 智能预加载，切换秒开

---

## 📊 数据源矩阵

### 聚合平台（5 个）

| 平台 | 说明 | 特点 |
|:-----|:-----|:-----|
| **AI今日热榜** | AI 热点聚合 | 聚合 arXiv、Anthropic、Hugging Face、Google Research 等 20 个 AI 一手来源 |
| **Info Flow** | RSS 信息流 | 聚合 Hacker News、V2EX、少数派、IT之家等 12 个技术社区 |
| **Zeli** | HN 24h 热榜 | Hacker News 24 小时最热，带准确发布时间 |
| **AIbase** | AI 资讯 | 中文 AI 资讯，覆盖大模型发布与产业动态 |
| **微信公众号** | 公众号聚合 | 14 个账号：AI 6 + 科技媒体 6 + 技术开发 2 |

### 微信公众号订阅（14 个）


精选 14 个账号，只保留 AI 与科技媒体两类，另加两个技术开发者账号：

| 公众号 | 分类 | 说明 |
|:-------|:-----|:-----|
| **机器之心** | AI | 头部媒体，深度报道 |
| **量子位** | AI | 前沿动态 |
| **新智元** | AI | 产业媒体，技术与应用 |
| **DeepTech深科技** | AI | 深度科技报道 |
| **PaperWeekly** | AI | 论文解读，学术前沿 |
| **AI前线** | AI | InfoQ 旗下 AI 技术媒体 |
| **36氪** | 科技媒体 | 头部科技商业媒体 |
| **晚点LatePost** | 科技媒体 | 深度商业报道，科技巨头内幕 |
| **极客公园** | 科技媒体 | 科技创新报道 |
| **少数派** | 科技媒体 | 数字生活，效率工具 |
| **爱范儿** | 科技媒体 | 消费科技媒体 |
| **虎嗅App** | 科技媒体 | 科技商业评论 |
| **GitHubDaily** | 技术开发 | 开源项目推荐 |
| **InfoQ** | 技术开发 | 软件开发技术媒体 |

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm（推荐）或 npm

### 安装与运行

```bash
# 克隆项目
git clone https://github.com/SuYxh/ai-news-aggregator.git
cd ai-news-aggregator

# 安装依赖
pnpm install

# 运行数据抓取
pnpm fetch

# 启动 Web 界面
cd web && pnpm install && pnpm dev
```

### 命令说明

```bash
# 完整抓取（所有数据源）
pnpm fetch

# Web 开发模式
cd web && pnpm dev

# Web 生产构建
cd web && pnpm build
```

### 命令行参数

| 参数 | 默认值 | 说明 |
|:-----|:-------|:-----|
| `--output-dir` | `data` | 输出目录 |
| `--window-hours` | `24` | 时间窗口（小时） |

---

## 📁 输出文件

运行后在 `data/` 目录生成：

| 文件 | 说明 |
|:-----|:-----|
| `latest-24h.json` | 最近 24 小时 AI 资讯 |
| `latest-7d.json` | 最近 7 天 AI 资讯 |
| `source-status.json` | 数据源抓取状态 |

### 数据结构

```json
{
  "generated_at": "2026-11-18T03:00:00Z",
  "window_hours": 24,
  "total_items": 488,
  "source_count": 36,
  "site_stats": [
    { "site_id": "aihot", "site_name": "AI今日热榜", "count": 280 }
  ],
  "items": [
    {
      "id": "abc123...",
      "site_id": "aihot",
      "site_name": "AI今日热榜",
      "source": "OpenAI",
      "title": "GPT-5 即将发布",
      "url": "https://...",
      "published_at": "2026-11-18T02:00:00Z"
    }
  ]
}
```

---

## 🔧 自定义配置

### 调整数据源

抓取源在 `src/config.ts`，抓取器在 `src/fetchers/`：

- 增删聚合平台：改 `src/fetchers/index.ts` 的注册表
- 增删微信公众号：改 `src/fetchers/wechat-rss.ts` 顶部的账号数组

### GitHub Actions 自动更新

项目已配置 GitHub Actions，每 2 小时自动：
1. 抓取所有数据源
2. 构建 Web 应用
3. 部署到 GitHub Pages

如需修改更新频率，编辑 `.github/workflows/update-ai-news.yml`：

```yaml
schedule:
  - cron: "0 */2 * * *"  # 每 2 小时
```

---

## 🏗️ 项目结构

```
ai-news-aggregator/
├── src/                      # 数据抓取源码
│   ├── index.ts              # 主入口
│   ├── config.ts             # 配置
│   ├── types.ts              # 类型定义
│   ├── fetchers/             # 各平台抓取器
│   │   ├── wechat-rss.ts     # 微信公众号抓取
│   │   └── ...               # 其他平台
│   ├── filters/              # 过滤器（AI 相关性、去重）
│   └── utils/                # 工具函数
├── web/                      # Web 前端
│   ├── src/
│   │   ├── components/       # React 组件
│   │   ├── hooks/            # 自定义 Hooks
│   │   └── App.tsx           # 应用入口
│   ├── index.html
│   └── vite.config.ts
├── assets/                   # 截图资源
├── data/                     # 输出数据
└── .github/workflows/        # GitHub Actions
```

---

## 🛠️ 技术栈

### 数据抓取

| 技术 | 用途 |
|:-----|:-----|
| **TypeScript** | 类型安全 |
| **Cheerio** | HTML 解析 |
| **rss-parser** | RSS 解析 |
| **fast-xml-parser** | XML 解析 |
| **dayjs** | 日期处理 |
| **p-limit** | 并发控制 |

### Web 前端

| 技术 | 用途 |
|:-----|:-----|
| **React 18** | UI 框架 |
| **TypeScript** | 类型安全 |
| **Vite** | 构建工具 |
| **Tailwind CSS** | 样式框架 |
| **Lucide React** | 图标库 |
| **DESIGN.md** | 设计令牌，由 design.md 导出 tailwind.theme.json 驱动 Tailwind |

---

## 📝 更新日志

查看 [CHANGELOG.md](./CHANGELOG.md) 了解版本更新详情。

---

## 📄 License

MIT © [SuYxh](https://github.com/SuYxh)

---

<div align="center">

**如果这个项目对你有帮助，欢迎 ⭐ Star 支持！**

[🐛 报告问题](https://github.com/SuYxh/ai-news-aggregator/issues) · [💡 功能建议](https://github.com/SuYxh/ai-news-aggregator/issues)

</div>
