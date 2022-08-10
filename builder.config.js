const Env = require('./src/env').default
const ICONS_DIR = 'build/icons/'

const productName = Env.get('APP_NAME', 'Emodyz Launcher')
const appId = Env.get('APP_ID', 'com.emodyz.launcher')

const snakedProductName = productName.toLowerCase().replace(' ', '_')

const windowsOS = {
  win: {
    icon: ICONS_DIR + 'win-icon.ico',
    publisherName: snakedProductName,
    target: 'nsis',
    verifyUpdateCodeSignature: false // TODO: Force use signature for windows ?
  },

  nsis: {
    differentialPackage: true
  }
}

const linuxOS = {
  linux: {
    icon: ICONS_DIR,
    target: 'deb'
  }
}

const macOS = {
  mac: {
    target: ['zip', 'dmg'],
    icon: ICONS_DIR + 'con.icns'
  },
  dmg: {
    contents: [
      {
        x: 410,
        y: 150,
        type: 'link',
        path: '/Applications'
      },
      {
        x: 130,
        y: 150,
        type: 'file'
      }
    ]
  }
}

module.exports = {
  productName,
  appId,
  artifactName: `${snakedProductName}-\${version}.\${ext}`,
  directories: {
    output: 'build'
  },
  // updater
  publish: [
    {
      provider: 'generic',
      url: `${Env.get('APP_URL', 'http://localhost')}/launcher`,
      channel: 'latest'
    }
  ],

  // default files: https://www.electron.build/configuration/contents
  files: [
    'package.json',
    {
      from: 'dist/main/',
      to: 'dist/main/'
    },
    {
      from: 'dist/renderer',
      to: 'dist/renderer/'
    }
  ],
  extraResources: [
    {
      from: 'src/extraResources/',
      to: ''
    }
  ],
  ...windowsOS,
  ...linuxOS,
  ...macOS
}
