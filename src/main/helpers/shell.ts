import { ipcMain, shell } from 'electron'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
ipcMain.handle('electron.shell.openExternal', async function (event, url) {
  await shell.openExternal(url)
})
