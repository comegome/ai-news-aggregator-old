import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const { theme } = require('./tailwind.theme.json')

// design.md 的导出只带字号/字重/字距，行高在这里补。
const lineHeights = { wordmark: '1.2', headline: '1.45', title: '1.4', meta: '1.4' }
const fontSize = {}
for (const [key, value] of Object.entries(theme.extend.fontSize)) {
  const [size, options = {}] = value
  fontSize[key] = [size, { ...options, lineHeight: lineHeights[key] ?? '1.4' }]
}

const SANS = "Roboto, 'Noto Sans SC', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      ...theme.extend,
      fontSize,
      fontFamily: { ...theme.extend.fontFamily, sans: [SANS] },
      boxShadow: {
        // 全站唯一的阴影：搜索框聚焦
        search: '0 1px 6px rgba(32, 33, 36, 0.28)',
        modal: '0 24px 48px rgba(0, 0, 0, 0.28)',
      },
      animation: {
        'fade-in': 'fadeIn 0.16s ease-out',
        'slide-up': 'slideUp 0.2s cubic-bezier(0.2, 0, 0, 1)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
