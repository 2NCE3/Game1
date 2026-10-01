/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
        display: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          '"SF Mono"',
          'ui-monospace',
          'Menlo',
          'Monaco',
          'Consolas',
          '"JetBrains Mono"',
          'monospace',
        ],
      },
      colors: {
        space: {
          950: '#06070a',
          900: '#0c0d12',
          850: '#12131a',
          800: '#181a24',
          700: '#222533',
          600: '#2d3144',
        },
        apple: {
          blue: '#0071e3',
          hover: '#0077ed',
          gray: '#86868b',
          dark: '#1d1d1f',
        },
        nasa: {
          orange: '#ff5c00',
          red: '#dc2626',
          amber: '#f59e0b',
          blue: '#0071e3',
          cyan: '#00e5ff',
          neon: '#0df',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 30s linear infinite',
      }
    },
  },
  plugins: [],
}
