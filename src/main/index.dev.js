import fs from 'fs'
import path from 'path'
import { app, Menu, MenuItem } from 'electron'
import electronDebug from 'electron-debug'
import vueDevtools from 'vue-devtools'
import { ELECTRON_RELAUNCH_CODE } from '../../.electron-nuxt/config'
import mainWinHandler from './mainWindow'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

electronDebug({
  showDevTools: true,
  devToolsMode: 'detach'
})

// work around https://github.com/MarshallOfSound/electron-devtools-installer/issues/122
// which seems to be a result of https://github.com/electron/electron/issues/19468
if (process.platform === 'win32') {
  const appUserDataPath = app.getPath('userData')
  const devToolsExtensionsPath = path.join(appUserDataPath, 'DevTools Extensions')
  try {
    fs.unlinkSync(devToolsExtensionsPath)
  } catch (_) {
    // don't complain if the file doesn't exist
  }
}

app.on('ready', () => {
  vueDevtools.install()
  const menu = Menu.getApplicationMenu()
  const refreshButton = new MenuItem({
    label: 'Relaunch electron',
    accelerator: 'CommandOrControl+E',
    click: () => {
      app.exit(ELECTRON_RELAUNCH_CODE)
    }
  })
  const testButton = new MenuItem({
    label: 'DEV TOOL',
    click: () => {
      mainWinHandler.browserWindow.webContents.openDevTools()
    }
  })
  menu.append(testButton)
  menu.append(refreshButton)
  Menu.setApplicationMenu(menu)
})

mainWinHandler.onCreated(browserWindow => {
  browserWindow.webContents.openDevTools()
})

// Require `main` process to boot app
require('./index')
