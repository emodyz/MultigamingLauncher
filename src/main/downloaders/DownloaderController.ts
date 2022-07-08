import { ipcMain } from 'electron'
import Downloader from '../comunication/Downloader'
import { Channels, DownloaderEvents } from '../../shared/comunication/downloader/DownloaderContract'
import { send } from '../helpers/events'

export default class DownloaderController {
  private static downloaders: Map<string, Downloader> = new Map<string, Downloader>()

  public static getDownloaders () {
    return Array.from(this.downloaders.values()).map(downloader => {
      return {
        serverId: downloader.serverId,
        state: downloader.downloader.state,
        stats: downloader.downloader.stats()
      }
    })
  }

  public static add (serverId: string, downloader: Downloader) {
    if (this.has(serverId)) {
      console.error('Downloader already created for this server, aborting the mission...')
      return
    }

    send(DownloaderEvents.CREATED, serverId)

    this.downloaders.set(serverId, downloader)
  }

  public static remove (serverId: string) {
    send(DownloaderEvents.DELETED, serverId)

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
      // @ts-ignore
      return await this.get(serverId).start(forceDownload)
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcMain.handle(Channels.STOP, async (event, serverId: string) => {
      // @ts-ignore
      return await this.get(serverId).stop()
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcMain.handle(Channels.PAUSE, async (event, serverId: string) => {
      // @ts-ignore
      return await this.get(serverId).pause()
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcMain.handle(Channels.RESUME, async (event, serverId: string) => {
      // @ts-ignore
      return await this.get(serverId).resume()
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcMain.handle(Channels.CALL, async (event, serverId: string, functionToCall: string, ...args: any[]) => {
      // @ts-ignore
      return this.get(serverId).call(functionToCall, args)
    })
  }
}
