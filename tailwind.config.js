/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f6f1',
          100: '#e1ebe0',
          200: '#c3d7c2',
          300: '#9abb99',
          400: '#6e9a6d',
          500: '#4e7f4d',
          600: '#3c673c',
          700: '#2f5d3a',
          800: '#244428',
          900: '#1d3521',
        },
        stone: {
          warm: '#f5f3ee',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
