/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0f172a',
          blue: '#1e3a8a',
          teal: '#0d9488',
          light: '#f8fafc',
        },
        status: {
          safe: '#22c55e', // Green
          warning: '#eab308', // Yellow
          maintenance: '#f97316', // Orange
          critical: '#ef4444', // Red
          offline: '#94a3b8', // Grey
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
