import { ipcMain, dialog } from 'electron'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
ipcMain.handle('electron.dialog.showOpenDialog', async function (event, args) {
  return (await dialog.showOpenDialog(args)).filePaths
})
