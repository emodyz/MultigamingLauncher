const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: 'media',
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: [],
  theme: {
    extend: {
      colors: {
        gray: colors.gray,
        emerald: colors.emerald,
        orange: colors.orange
      }
    }
  },
  variants: {
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}
