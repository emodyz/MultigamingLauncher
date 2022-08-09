/**
 * By default, Nuxt.js is configured to cover most use cases.
 * This default configuration can be overwritten in this file
 * @link {https://nuxtjs.org/guide/configuration/}
 */

const Env = require('../env').default

module.exports = {
  ssr: false,
  target: 'static',
  head: {
    title: 'EZGames',
    meta: [
      { charset: 'utf-8' }
    ]
  },
  loading: false,
  css: [
    '~/assets/global.scss',
    '~/assets/tooltip.css',
    '~/assets/transitions.scss'
  ],
  plugins: [
    { src: '~/plugins/vuex-persist', ssr: false },
    '~/plugins/vue-tooltip.js',
    '~/plugins/axios-accessor.ts'
  ],
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxt/postcss8'
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],
  router: {
    middleware: ['auth'],
    extendRoutes (routes) {
      routes.push(
        { path: '/', redirect: '/home' }
      )
    }
  },
  auth: {
    redirect: {
      login: '/auth/login',
      logout: '/auth/login',
      home: '/home'
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
    baseURL: `${Env.get('APP_URL')}/api`
  },
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {}
      }
    }
  }
}
