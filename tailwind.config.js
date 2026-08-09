/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        election: {
          red: '#D32F2F',
          gold: '#FFD700',
          dark: '#1E293B',
          accent: '#0284C7'
        }
      }
    },
  },
  plugins: [],
}
