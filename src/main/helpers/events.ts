import { webContents } from 'electron'

export function send (channel: string, ...args: any[]) {
  webContents.getAllWebContents().forEach(webContent => webContent.send(channel, ...args))
}
