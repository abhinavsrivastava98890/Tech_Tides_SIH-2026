/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        card: '#FFFFFF',
        primary: '#2563EB',
        navy: '#0F172A',
        aqua: '#0891B2',
        water: '#0891B2',
        success: '#16A34A',
        warning: '#F59E0B',
        danger: '#EF4444',
        critical: '#EF4444',
        text: '#0F172A',
        muted: '#64748B',
        border: '#E2E8F0',
        accent: '#0891B2',
        blue: {
          500: '#2563EB'
        }
      },
      ringColor: {
        DEFAULT: '#2563EB',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
