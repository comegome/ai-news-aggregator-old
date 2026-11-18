---
version: alpha
name: AGIgregator
description: 一个 Google News 式的 AI 资讯阅读器。单栏阅读列、细线分隔、单一蓝色强调色，不画卡片、不用阴影。

colors:
  primary: "#1A73E8"
  primary-hover: "#1765CC"
  primary-dark: "#8AB4F8"
  on-primary: "#FFFFFF"
  primary-container: "#E8F0FE"
  primary-strong: "#1967D2"
  primary-container-dark: "#1E2E45"
  surface: "#FFFFFF"
  surface-dark: "#202124"
  surface-subtle: "#F8F9FA"
  surface-subtle-dark: "#303134"
  ink: "#202124"
  ink-secondary: "#5F6368"
  ink-muted: "#80868B"
  ink-dark: "#E8EAED"
  ink-dark-secondary: "#9AA0A6"
  hairline: "#DADCE0"
  hairline-dark: "#3C4043"

typography:
  wordmark:
    fontFamily: "Roboto, 'Noto Sans SC', 'PingFang SC', sans-serif"
    fontSize: 21px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Roboto, 'Noto Sans SC', 'PingFang SC', sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.45
  title:
    fontFamily: "Roboto, 'Noto Sans SC', 'PingFang SC', sans-serif"
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.4
  meta:
    fontFamily: "Roboto, 'Noto Sans SC', 'PingFang SC', sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.4

rounded:
  sm: 4px
  md: 8px
  lg: 12px
  xl: 28px
  full: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px

components:
  appbar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    height: 64px
  appbar-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.ink-dark}"
  wordmark-accent:
    textColor: "{colors.primary}"
    typography: "{typography.wordmark}"
  wordmark-accent-dark:
    textColor: "{colors.primary-dark}"
  search:
    backgroundColor: "{colors.surface-subtle}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.full}"
    padding: 10px
  search-dark:
    backgroundColor: "{colors.surface-subtle-dark}"
    textColor: "{colors.ink-dark}"
  search-placeholder:
    textColor: "{colors.ink-muted}"
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.meta}"
    rounded: "{rounded.full}"
    padding: 6px
  chip-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.ink-dark-secondary}"
  chip-selected:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.primary-strong}"
  chip-selected-dark:
    backgroundColor: "{colors.primary-container-dark}"
    textColor: "{colors.primary-dark}"
  row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    padding: 16px
  row-hover:
    backgroundColor: "{colors.surface-subtle}"
  row-hover-dark:
    backgroundColor: "{colors.surface-subtle-dark}"
  divider:
    backgroundColor: "{colors.hairline}"
    height: 1px
  divider-dark:
    backgroundColor: "{colors.hairline-dark}"
    height: 1px
  headline-text:
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
  headline-text-dark:
    textColor: "{colors.ink-dark}"
  meta-text:
    textColor: "{colors.ink-secondary}"
    typography: "{typography.meta}"
  meta-text-dark:
    textColor: "{colors.ink-dark-secondary}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.title}"
    rounded: "{rounded.full}"
    padding: 8px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  modal:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: 24px
  modal-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.ink-dark}"
---

## Overview

这不是「卡片流」，是**一张报纸的阅读列**。

参考对象是 Google News 的搜索结果页和 Google 搜索的顶栏，不是任何仪表盘模板。整个页面只有一条 720px 宽的竖列，条目之间用 1px 细线分隔，没有边框、没有阴影、没有圆角卡片。鼠标悬停时整行背景变浅灰——这是 Google 搜索结果唯一的交互反馈。

判定标准：把截图缩到 30% 大小，如果第一眼看到的是「一堆方块」，就说明还没做到。

## Colors

- **Primary #1A73E8** —— 全站唯一强调色。只出现在三处：词标里的「AGI」、选中态的文字与浅蓝底、文字按钮。
- **Primary Container #E8F0FE** —— 选中 chip 的底色。Google 的选中态是**浅底深字**，不是深底白字；这一条是 M3 与「网页版 Bootstrap 风」最大的分野。
- **Surface #FFFFFF / Surface Subtle #F8F9FA** —— 页面白，悬停灰。两者只差一个色阶，靠细线而非边框分隔。
- **Ink #202124** —— 正文。不是纯黑。
- **Ink Secondary #5F6368** —— 来源名、时间。**比标题浅一档**，视线先落在标题上。
- **Hairline #DADCE0** —— 1px 分隔线。全站唯一的「结构线」，不用它画框。

深色模式把 Surface 换成 #202124、悬停换成 #303134、强调色提亮到 #8AB4F8。深底上蓝色必须提亮，否则对比度不足。

## Typography

Roboto 自托管（`web/public/fonts/`，variable 单文件，latin + latin-ext 共 61KB），中文回落到 PingFang SC / 思源黑体。**不引 Google Fonts CDN**——中国大陆访问不到，会白屏一秒。

字号只有四级：

- **wordmark 21 / 500** —— 只用于标题「AGIgregator」
- **headline 17 / 400** —— 资讯标题。**常规字重**，不加粗。Google News 的标题就是常规体，靠字号和位置区分层级
- **title 15 / 500** —— 弹窗标题、按钮
- **meta 13 / 400** —— 来源、时间、统计

中文没有小写字母，常规字重下笔画密度天然高于英文，所以标题**绝不能**再用 700——这正是「中式」的来源之一。

## Layout

- 顶栏 64px，吸顶，底部一条细线
- 正文列 `max-width: 720px`，水平居中，左右 16px 内边距
- 条目：上 16px / 下 16px，无左右内边距（悬停时用负边距 + 12px 内边距铺满，视觉上不留白）
- 条目内：来源名 13px → 标题 17px（间距 4px）→ 副来源 13px（可选）

720px 是刻意的：Google News 的阅读列大约 600–740px。放宽到 1152px 会让标题横跨一屏，眼睛无法一次扫完一行。

## Elevation & Depth

**没有阴影，除了一个地方：搜索框聚焦。**

Google 搜索框静止时是无边框的浅灰圆角矩形；聚焦时变白并浮起一层 `0 1px 6px rgba(32,33,36,.28)`。这个「从平面到浮起」的转换是全站唯一的立体感来源，用它标记「你正在输入」。

## Shapes

- 圆角：4 / 8 / 12 / 28 / 全圆
- 搜索框、chip、按钮：全圆
- 弹窗：28px（M3 dialog 的规格）
- **条目：0 圆角**——列表项不是卡片

## Components

- `appbar` —— 左词标，中搜索框，右主题切换。移动端搜索框折到第二行。
- `chip` —— 平台筛选。未选中是**描边**（1px hairline + 透明底），选中是浅蓝底 + 蓝字。
- `row` —— 资讯条目。悬停整行变 #F8F9FA。
- `button-primary` —— 只有「加载更多」用，且是文字按钮形态。

## Do's and Don'ts

- **Do** 用留白和细线分层，不用容器。
- **Do** 让标题比元信息明显更大、更黑，但不更粗。
- **Don't** 给列表项加边框、圆角、阴影——那是卡片，不是报纸。
- **Don't** 用深色底 + 白字的选中态。
- **Don't** 从 CDN 拉字体。
