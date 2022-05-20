import { ipcRenderer } from 'electron'
import DownloaderProtocol, { Channels } from '../../shared/comunication/downloader/DownloaderProtocol'

export default class Downloader implements DownloaderProtocol {
  private readonly serverId: string

  constructor (serverId: string) {
    this.serverId = serverId
  }

  get filesToDownload (): Promise<number> {
    return this.emit(Channels.CALL, 'filesToDownload')
  }

  async pause (): Promise<void> {
    console.log('download paused ui', this.serverId)
    return await this.emit(Channels.PAUSE)
  }

  async resume (): Promise<void> {
    console.log('download resumed ui', this.serverId)
    return await this.emit(Channels.RESUME)
  }

  async start (forceDownload: boolean): Promise<void> {
    console.log('download started ui', this.serverId)
    return await this.emit(Channels.START, forceDownload)
  }

  async stop (): Promise<void> {
    console.log('download stopped ui', this.serverId)
    return await this.emit(Channels.STOP)
  }

  /**
   * Private methods (helpers)
   */

  private async emit (channel: string, ...data): Promise<any> {
    return await ipcRenderer.invoke(channel, this.serverId, ...data)
  }
}
