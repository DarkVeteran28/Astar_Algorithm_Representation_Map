/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      colors: {
        sky: {
          400: '#38bdf8',
          500: '#0ea5e9',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        red: {
          400: '#f87171',
          500: '#ef4444',
        },
        green: {
          400: '#4ade80',
          500: '#22c55e',
        },
        purple: {
          400: '#c084fc',
          500: '#a855f7',
        },
      },
      animation: {
        'node-pulse': 'nodePulse 2s ease-in-out infinite',
        'draw-road': 'drawRoad 2s ease forwards',
        'dim-enter': 'dimEnter 0.6s ease forwards',
        'congestion-pulse': 'congestionPulse 1.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease forwards',
      },
      keyframes: {
        nodePulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.15)', opacity: '0.85' },
        },
        drawRoad: {
          to: { strokeDashoffset: '0' },
        },
        dimEnter: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        congestionPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};