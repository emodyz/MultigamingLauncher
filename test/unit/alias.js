const path = require('path')

const ROOT = path.join(__dirname, '..', '..', 'src', 'renderer')
const SHARED = path.join(__dirname, '..', '..', 'src', 'shared')

module.exports = {
  resolve: {
    alias: {
      '@': ROOT,
      '@/shared': SHARED
    },
    extensions: [
      '.vue', '.js'
    ]
  }
}
