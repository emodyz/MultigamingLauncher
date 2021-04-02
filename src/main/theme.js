import { ipcMain, nativeTheme } from 'electron'
import winHandler from './mainWindow'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
ipcMain.handle('theme.themeSource', async function (event, themeSource = true) {
  if (themeSource) {
    nativeTheme.themeSource = themeSource
  }
  return nativeTheme.themeSource
})

ipcMain.on('theme.shouldUseDarkColors', async function (event) {
  event.returnValue = nativeTheme.shouldUseDarkColors
})

nativeTheme.on('updated', () => {
  winHandler.browserWindow.webContents.send('theme.updated', 'toot')
})
