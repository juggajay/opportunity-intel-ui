/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        foreground: '#fafafa',
        card: '#141414',
        'card-hover': '#1a1a1a',
        border: '#262626',
        muted: '#a1a1aa',
        'muted-foreground': '#71717a',
        // Thesis colors
        'thesis-ai': '#3b82f6',
        'thesis-trust': '#8b5cf6',
        'thesis-physical': '#f59e0b',
        'thesis-incumbent': '#ef4444',
        'thesis-speed': '#10b981',
        'thesis-execution': '#06b6d4',
        // Status colors
        'status-new': '#3b82f6',
        'status-exploring': '#f59e0b',
        'status-validating': '#8b5cf6',
        'status-pursuing': '#10b981',
        'status-passed': '#6b7280',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
