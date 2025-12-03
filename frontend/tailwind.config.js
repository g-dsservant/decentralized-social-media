/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          50: '#e9f7ff',
          100: '#d2efff',
          200: '#9fe0ff',
          500: '#2eb6ff',
          700: '#1a88d6'
        },
        surface: {
          50: '#0b0f13',
          100: '#0f1317',
          200: '#121417'
        }
      },
      boxShadow: {
        soft: '0 6px 24px rgba(2,6,23,0.6)',
        neon: '0 8px 28px rgba(46,182,255,0.08), 0 0 8px rgba(46,182,255,0.06)'
      },
      borderRadius: {
        xl: '12px'
      }
    }
  },
  plugins: [],
};
