/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Sofia: ["Sofia Sans"], 
      },
      colors: {
        'custom-dark': '#1e1e1e',
      },
    },
  },
  plugins: [],
}
