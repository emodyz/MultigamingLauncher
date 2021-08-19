import winHandler from '../mainWindow'

export function send (channel: string, ...args: any[]) {
  winHandler.browserWindow.webContents.send(channel, ...args)
}
