/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['IBM Plex Sans', 'sans-serif'],
        'serif': ['IBM Plex Serif', 'serif'],
        'mono': ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        'gauge-coral': '#FF6B6B',
        'gauge-coral-1': '#FF6B8A',
        'gauge-coral-2': '#FFB84D',
        'gauge-coral-3': '#4DD4FF',
        'gauge-coral-4': '#FFAB6B',
        'gauge-coral-5': '#FF4B6B',
        'gauge-purple': '#6B5B95',
      },
    },
  },
  plugins: [],
}