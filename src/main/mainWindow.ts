import { BrowserWindow } from 'electron'
import BrowserWinHandler from './BrowserWinHandler'

const winHandler = new BrowserWinHandler({
  height: 600,
  width: 1000
})

winHandler.onCreated((_browserWindow: BrowserWindow) => {
  winHandler.loadPage('/')
  // Or load custom url
  // _browserWindow.loadURL('https://google.com')
})

export default winHandler
