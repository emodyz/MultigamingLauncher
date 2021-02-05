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
    },
    fontFamily: {
      sans: ['Mulish']
    }
  },
  variants: {
    extend: {
      backgroundColor: ['checked'],
      borderColor: ['checked']
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}
