const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  darkMode: 'media',
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './components/**/*.{vue,js}',
      './layouts/**/*.vue',
      './pages/**/*.vue',
      './plugins/**/*.{js,ts}',
      './nuxt.config.{js,ts}'
    ],
    options: {
      safelist: [
        // THE DARK SIDE 😈
        'dark',
        // Scrollbar
        'body', 'body.dark', '::-webkit-scrollbar',
        '::-webkit-scrollbar-track', '::-webkit-scrollbar-thumb',
        '::-webkit-scrollbar-thumb:hover ',
        // Colors
        'text-green-600', 'text-green-900',
        'text-indigo-600', 'text-indigo-900',
        'text-red-600', 'text-red-900', 'text-orange-500',
        // Utilities
        'py-8', 'pb-5', 'pt-6',
        'w-88', 'w-96'
      ]
    }
  },

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
      typography: ['dark'],
      backgroundColor: ['group-focus', 'active', 'even', 'odd', 'disabled', 'checked'],
      borderColor: ['group-focus', 'checked'],
      boxShadow: ['group-focus'],
      opacity: ['group-focus', 'disabled'],
      cursor: ['hover', 'focus', 'disabled'],
      textColor: ['group-focus', 'active', 'disabled'],
      textDecoration: ['group-focus'],
      fontWeight: ['hover', 'focus']
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
}
