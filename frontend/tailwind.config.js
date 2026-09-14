/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#fffff2',
        card: '#FFFFEB',
        primary: '#164A63',
        teal: '#287D7B',
        water: '#5B9DB5',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        text: '#263238',
        muted: '#687477',
        border: '#D8D0C6',
        accent: '#6ab2f9',
        blue: {
          500: '#6ab2f9'
        }
      },
      ringColor: {
        DEFAULT: '#6ab2f9',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
