/**
 * By default, Nuxt.js is configured to cover most use cases.
 * This default configuration can be overwritten in this file
 * @link {https://nuxtjs.org/guide/configuration/}
 */

module.exports = {
  ssr: false,
  head: {
    title: 'multigaming-launcher',
    meta: [{ charset: 'utf-8' }]
  },
  loading: false,
  plugins: [

  ],
  buildModules: [
    '@nuxt/typescript-build'
  ],
  modules: [

  ]
}
