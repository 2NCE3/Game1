/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#040711',
          900: '#070b18',
          850: '#0b1226',
          800: '#101a38',
          700: '#182650',
          600: '#22366f',
        },
        nasa: {
          orange: '#ff5c00',
          red: '#dc2626',
          amber: '#f59e0b',
          blue: '#0284c7',
          cyan: '#00e5ff',
          neon: '#0df',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Space Mono"', 'monospace'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 30s linear infinite',
      }
    },
  },
  plugins: [],
}
