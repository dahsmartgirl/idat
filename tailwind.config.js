/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Cascadia Mono"', '"JetBrains Mono"', 'monospace'],
      },
      colors: {
        idat: {
          bg: '#F2F1F3',
          darkBg: '#0c0c0e',
          text: '#545454',
          pill: '#E9E9E9',
          block: '#D9D9D9',
        }
      }
    },
  },
  plugins: [],
}
