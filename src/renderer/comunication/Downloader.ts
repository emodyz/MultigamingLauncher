import { ipcRenderer } from 'electron'
import DownloaderProtocol, { Channels } from '../../shared/comunication/downloader/DownloaderProtocol'

export default class Downloader implements DownloaderProtocol {
  private readonly serverId: string

  constructor (serverId: string) {
    this.serverId = serverId
  }

  async pause (): Promise<void> {
    return await this.emit(Channels.PAUSE)
  }

  async resume (): Promise<void> {
    return await this.emit(Channels.RESUME)
  }

  async start (forceDownload: boolean): Promise<void> {
    return await this.emit(Channels.START, forceDownload)
  }

  async stop (): Promise<void> {
    return await this.emit(Channels.STOP)
  }

  /**
   * Private methods (helpers)
   */

  private async emit (channel: string, ...data): Promise<any> {
    return await ipcRenderer.invoke(channel, this.serverId, ...data)
  }
}
