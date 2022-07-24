const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './src/renderer/components/**/*.{vue,js}',
    './src/renderer/layouts/**/*.vue',
    './src/renderer/pages/**/*.vue',
    './src/renderer/plugins/**/*.{js,ts}',
    './src/renderer/nuxt.config.{js,ts}'
  ],
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
  ],

  theme: {
    extend: {
      colors: {
        gray: colors.zinc
      }
    },
    fontFamily: {
      sans: ['Mulish']
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
}
