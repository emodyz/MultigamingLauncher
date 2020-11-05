/**
 * By default, Nuxt.js is configured to cover most use cases.
 * This default configuration can be overwritten in this file
 * @link {https://nuxtjs.org/guide/configuration/}
 */

module.exports = {
  ssr: false,
  head: {
    title: 'EZGames',
    meta: [{ charset: 'utf-8' }]
  },
  loading: false,
  css: [
    '~/assets/tooltip.css',
    '~/assets/transitions.scss'
  ],
  plugins: [
    '~/plugins/vue-tooltip.js'
  ],
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/tailwindcss'
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],
  router: {
    middleware: ['auth']
  },
  auth: {
    redirect: {
      login: '/auth/login',
      logout: '/auth/login',
      home: '/'
    },
    strategies: {
      local: {
        endpoints: {
          login: { url: '/auth/login', method: 'post', propertyName: 'access_token' },
          logout: false,
          user: { url: '/user', method: 'get', propertyName: 'data' }
        },
        tokenRequired: true,
        tokenType: 'Bearer',
        globalToken: true,
        autoFetchUser: true
      }
    }
  },
  axios: {
    baseURL: 'https://multigamingpanel.test/api'
  },
  tailwindcss: {
  }
}
