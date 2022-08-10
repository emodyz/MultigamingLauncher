import Env from './src/env'

const fs = require('fs')
const path = require('path')
const iconGen = require('icon-gen')

const iconFilePath = Env.get('ICON_PATH')

const options = {
  report: false,
  ico: {
    name: 'win-icon',
    sizes: [16, 24, 32, 48, 64, 128, 256]
  },
  icns: {
    name: 'icon',
    sizes: [16, 32, 64, 128, 256, 512, 1024]
  },
  favicon: {
    name: '{tmp}-',
    pngSizes: [16, 24, 32, 48, 64, 96, 128, 256],
    icoSizes: [16, 24, 32, 48, 64, 96, 128, 256]
  }
}

async function generate () {
  const files = await iconGen(
    path.resolve(__dirname, iconFilePath),
    path.resolve(__dirname, 'build/icons'),
    options
  ) as string[]
  const filesToRenames = files.filter(file => file.includes('{tmp}'))

  for (const fileToRename of filesToRenames) {
    const fileSize = path.basename(fileToRename)
      .replace('.png', '')
      .replace('{tmp}-', '')
    const newFilePath = fileToRename.replace('{tmp}-', `${fileSize}x`)

    fs.renameSync(fileToRename, newFilePath)
  }

  return 'Done'
}

if (fs.existsSync(iconFilePath)) {
  console.log(`File ${iconFilePath} present...`)

  generate()
    .then(res => console.log(res))
    .catch(error => console.error(error.message))
} else {
  console.info(`No ${iconFilePath} found...`)
}
