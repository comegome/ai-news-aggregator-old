import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const { theme } = require('./tailwind.theme.json')

// design.md 的导出不带 lineHeight（Material 的 type scale 只有字号/字重/字距），
// 这里补上，中文在 1.5 行高下才不挤。
const lineHeights = { headline: '1.3', title: '1.5', body: '1.5', label: '1.4' }
const fontSize = {}
for (const [key, value] of Object.entries(theme.extend.fontSize)) {
  const [size, options = {}] = value
  fontSize[key] = [size, { ...options, lineHeight: lineHeights[key] ?? '1.5' }]
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      ...theme.extend,
      fontSize,
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
