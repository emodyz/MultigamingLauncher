module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    sourceType: 'module'
  },
  ignorePatterns: [
    'src/env.js'
  ],
  extends: [
    '@nuxtjs/eslint-config-typescript'
  ],
  // add your custom rules here
  rules: {
    // StandardJS — The Rules
    indent: ['error', 2], // 2 spaces – for indentation
    camelcase: 'off',
    'import/export': 'off',
    'import/named': 'off',
    'max-len': ['error', { code: 120 }],
    'no-console': 'off',
    'arrow-parens': ['error', 'as-needed'],
    curly: ['error', 'multi-line'],
    'import/no-extraneous-dependencies': 'off',
    'require-await': 0,
    'vue/no-v-html': 'off',

    'global-require': 0,
    'import/no-unresolved': 0,
    'import/newline-after-import': 0,
    'no-underscore-dangle': 0,

    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 0
  }
}
