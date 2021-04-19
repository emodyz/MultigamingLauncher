import { ipcMain } from 'electron'

export default class DownloaderController {
  handleEvents () {
    ipcMain.handle('downloader.', function () {

    })
  }
}
