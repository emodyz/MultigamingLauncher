import { ipcMain } from 'electron'
import Downloader from '../comunication/Downloader'
import { Channels, Events } from '../../shared/comunication/downloader/DownloaderProtocol'
import { send } from '../helpers/events'

export default class DownloaderController {
  private static downloaders: Map<string, Downloader> = new Map<string, Downloader>()

  public static add (serverId: string, downloader: Downloader) {
    if (this.has(serverId)) {
      console.error('Downloader already created for this server, aborting the mission...')
      return
    }

    send(Events.CREATED, serverId)

    this.downloaders.set(serverId, downloader)
  }

  public static remove (serverId: string) {
    send(Events.DELETED, serverId)

    this.downloaders.delete(serverId)
  }

  public static has (serverId: string): boolean {
    return this.downloaders.has(serverId)
  }

  public static get (serverId: string) {
    return this.downloaders.get(serverId)
  }

  public static handleEvents () {
    console.log('Handle Downloader events')

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcMain.handle(Channels.START, async (event, serverId: string, forceDownload?: boolean) => {
      return await this.get(serverId).start(forceDownload)
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcMain.handle(Channels.STOP, async (event, serverId: string) => {
      return await this.get(serverId).stop()
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcMain.handle(Channels.PAUSE, async (event, serverId: string) => {
      return await this.get(serverId).pause()
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcMain.handle(Channels.RESUME, async (event, serverId: string) => {
      return await this.get(serverId).resume()
    })
  }
}
