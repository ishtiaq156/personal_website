const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      sky: colors.sky,
      blue: colors.blue,
      gray: colors.gray,
      slate: colors.slate,
      white: colors.white,
      pink: colors.pink,
    },
  },
  plugins: [],
}
