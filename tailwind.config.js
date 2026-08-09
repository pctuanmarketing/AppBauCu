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
          dark: '#131d2a',
          sidebar: '#1e293b',
          sidebarHover: '#334155',
          primary: '#0284c7',
          primaryDark: '#0369a1',
          accent: '#0d9488',
          bg: '#f8fafc',
          card: '#ffffff',
        }
      }
    },
  },
  plugins: [],
}
