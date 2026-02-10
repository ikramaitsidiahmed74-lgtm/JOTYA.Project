/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false,
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ffed00',
        'background-light': '#ffffff',
        'background-dark': '#1a1a1a',
        'background-section': '#e9e9e9',
      },
      spacing: {
        '0.5': '2px',
      }
    },
