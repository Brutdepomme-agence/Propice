/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        inter: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        accent: '#6195a4',
        'accent-dark': '#4a7a8a',
      },
    },
  },
  plugins: [],
}
