/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        command: {
          dark: '#030712',
          card: '#0B1222',
          border: '#1E293B',
          glow: '#06B6D4',
          accent: '#F59E0B',
        },
        slate: {
          850: '#111827',
          900: '#0f172a',
          950: '#020617',
          1000: '#01030b',
        },
        cyber: {
          cyan: '#06b6d4',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          indigo: '#6366f1',
        },
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        cobalt: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        electric: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        govNavy: {
          950: '#06132b',
          900: '#0b2046',
          800: '#10326d',
          700: '#184795',
          600: '#1d5ec4',
          500: '#2570ea',
        },
        energyCyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        karnatakaGold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-blue': '0 0 20px -3px rgba(37, 99, 235, 0.25)',
        'glow-sky': '0 0 20px -3px rgba(14, 165, 233, 0.25)',
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.3)',
        'glow-emerald': '0 0 20px -5px rgba(16, 185, 129, 0.25)',
        'glow-amber': '0 0 20px -5px rgba(245, 158, 11, 0.25)',
        'glow-rose': '0 0 20px -5px rgba(244, 63, 94, 0.25)',
        'glow-navy': '0 10px 30px -10px rgba(11, 32, 70, 0.35)',
        'inner-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.08)',
        'brand-glow': '0 4px 20px -2px rgba(37, 99, 235, 0.25)',
        'blue-glow': '0 4px 20px -2px rgba(37, 99, 235, 0.3)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2.5s linear infinite',
        'voltage-glow': 'voltageGlow 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(6, 182, 212, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        voltageGlow: {
          '0%': { boxShadow: '0 0 15px rgba(6, 182, 212, 0.25), 0 0 30px rgba(37, 99, 235, 0.15)' },
          '100%': { boxShadow: '0 0 25px rgba(6, 182, 212, 0.45), 0 0 45px rgba(37, 99, 235, 0.3)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
