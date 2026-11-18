---
version: alpha
name: AI News Aggregator
description: Google Material 3 风格的 AI 资讯阅读界面。英文优先、中文兜底，留白宽松，层级靠字号与描边而非阴影。

colors:
  primary: "#1A73E8"
  primary-hover: "#1765CC"
  primary-dark: "#8AB4F8"
  on-primary: "#FFFFFF"
  surface: "#FFFFFF"
  surface-variant: "#F8F9FA"
  surface-dark: "#202124"
  surface-variant-dark: "#2D2E31"
  background-dark: "#202124"
  ink: "#202124"
  ink-secondary: "#5F6368"
  ink-muted: "#80868B"
  ink-dark: "#E8EAED"
  outline: "#DADCE0"
  outline-dark: "#3C4043"

typography:
  headline:
    fontFamily: "Google Sans, Roboto, 'Noto Sans SC', 'PingFang SC', sans-serif"
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Roboto, 'Noto Sans SC', 'PingFang SC', sans-serif"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.5
  body:
    fontFamily: "Roboto, 'Noto Sans SC', 'PingFang SC', sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Roboto, 'Noto Sans SC', 'PingFang SC', sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4

rounded:
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px

components:
  page:
    backgroundColor: "{colors.surface-variant}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
  page-dark:
    backgroundColor: "{colors.background-dark}"
    textColor: "{colors.ink-dark}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.lg}"
    padding: 16px
  card-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.ink-dark}"
  divider:
    backgroundColor: "{colors.outline}"
    height: 1px
  divider-dark:
    backgroundColor: "{colors.outline-dark}"
    height: 1px
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: 8px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
  chip:
    backgroundColor: "{colors.surface-variant}"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: 4px
  chip-dark:
    backgroundColor: "{colors.surface-variant-dark}"
    textColor: "{colors.ink-dark}"
  chip-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 8px
  input-placeholder:
    textColor: "{colors.ink-muted}"
  link:
    textColor: "{colors.primary}"
    typography: "{typography.body}"
  link-dark:
    textColor: "{colors.primary-dark}"
---

## Overview

这是一个个人使用的 AI 资讯阅读器：每两小时抓取一次，前端只做一件事——让人快速扫读标题、判断哪条值得点开。因此视觉上追求 Google 式的克制：白底、单一蓝色强调色、描边代替阴影、字号分三级、留白大于密度。

风格来源是 Material 3 与 Google News 的阅读列表，不是任何「科技感」模板。不使用渐变、不使用彩色标签墙、不使用大圆角卡片堆叠。

## Colors

- **Primary (#1A73E8)** —— Google Blue 600。全站唯一的强调色：链接、选中态、主按钮。白色文字在其上对比度 4.51:1，刚好达到 WCAG AA。
- **Primary Dark (#8AB4F8)** —— 深色模式下的强调色。蓝色在白底上够暗，在深底上则必须提亮，否则读不清。配 #202124 对比度约 7.4:1。
- **Ink (#202124)** —— 正文主色，不是纯黑。纯黑在屏幕上过硬，Google 的灰阶在长时间阅读时更稳。
- **Ink Secondary (#5F6368)** —— 来源名、时间戳、辅助说明。
- **Ink Muted (#80868B)** —— 占位符、悬停才出现的图标，最低一级信息。
- **Surface (#FFFFFF) / Surface Variant (#F8F9FA)** —— 卡片白、页面底色微灰。两者的差别很小，正是为了让卡片浮起来又不靠阴影。
- **Outline (#DADCE0)** —— 1px 描边。卡片边界、分隔线都靠它，替代阴影。

## Typography

字体栈是 `Google Sans / Roboto → Noto Sans SC → PingFang SC`。拉丁字形由前两个渲染，中日韩字形自动回落到思源黑体或苹方，两者字面高度接近，中英混排不会出现一行里字重忽粗忽细。

字号只有四级：headline 22 / title 16 / body 16 / label 14。中文网页常见的 12px 辅助文字在这里被抬到 14px，行高统一 1.4–1.5。这是「不中式」最直接的来源——不是换颜色，是给文字留够呼吸空间。

标题不再使用 bold 700，改用 500。Material 的层级靠字号和颜色，不靠加粗。

## Layout

最大宽度 1152px（`max-w-6xl`），左右内边距 16/24/32px 三档响应式。列表条目之间 12px，区块之间 24px。卡片内边距 16px 竖向、20px 横向。

间距基准是 4px 栅格：4 / 8 / 16 / 24 / 32。

## Elevation & Depth

**不使用阴影。** 卡片与页面背景只差一个色阶（#FFFFFF vs #F8F9FA），边界由 1px #DADCE0 描边给出。悬停时描边变为主色，不做位移、不加投影。

这是刻意的：原实现用 `shadow-sm` 加 `hover:shadow-md` 加 `-translate-y-0.5`，三层效果叠加，在深色模式下阴影几乎不可见却仍在渲染。

## Shapes

圆角三档：4px（小控件）、8px（输入框）、12px（卡片），以及全圆（按钮、标签）。

不使用大于 12px 的圆角，也不做「药丸卡片」。

## Components

- `card` —— 资讯条目。白底、1px 描边、12px 圆角。悬停时描边变蓝。
- `chip` / `chip-active` —— 站点筛选标签。未选中是灰底灰字，选中是蓝底白字。
- `button-primary` —— 只在「加载更多」这类单一动作上使用。
- `input` —— 搜索框。聚焦时描边变蓝，不加外发光。

## Do's and Don'ts

- **Do** 用描边和留白区分层级。
- **Do** 保持全站只有一个强调色。
- **Don't** 加渐变、发光、玻璃拟态。头部那条 `backdrop-blur` 是唯一例外。
- **Don't** 用阴影表达悬停；用描边颜色变化。
- **Don't** 把字号压到 12px 以下——中文在 12px 下笔画会糊。
