/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#ABC270',
        secondary: '#FEC868',
        accent: '#FDA769',
        dark: '#473C33',
        'bg-light': '#f5f7fa',
        'text-light': '#8a8f9a',
        'border-light': '#e8ecf1',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
