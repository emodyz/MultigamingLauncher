import DownloaderProtocol, { Events } from '../../shared/comunication/downloader/DownloaderProtocol'
import { Downloader as BaseDownloader } from '../../sdk/Sdk'
import DownloaderController from '../downloaders/DownloaderController'
import { send } from '../helpers/events'

export default class Downloader implements DownloaderProtocol {
  serverId: string
  downloader: BaseDownloader

  constructor (serverId: string, downloader: BaseDownloader) {
    this.serverId = serverId
    this.downloader = downloader

    this.handleEvents()
  }

  call (functionToCall: string, ...args: any[]): any {
    // @ts-ignore
    if (typeof this.downloader[functionToCall] === 'function') {
      // @ts-ignore
      return this.downloader[functionToCall](...args)
    }
    // @ts-ignore
    return this.downloader[functionToCall]
  }

  pause (): Promise<void> {
    this.downloader.pause()

    send(Events.DOWNLOAD_PAUSED, this.serverId)

    return Promise.resolve()
  }

  resume (): Promise<void> {
    return this.downloader.resume()
      .then(() => {
        send(Events.DOWNLOAD_RESUMED, this.serverId)
      })
  }

  start (forceDownload: boolean = false): Promise<void> {
    return this.downloader.start(forceDownload)
      .then(() => {
        send(Events.DOWNLOAD_STARTED, this.serverId)
      }).catch((e: any) => {
        send(Events.ERROR, this.serverId, e)
        DownloaderController.remove(this.serverId)
      })
  }

  stop (): Promise<void> {
    this.downloader.stop()

    send(Events.DOWNLOAD_STOPPED, this.serverId)

    return Promise.resolve()
  }

  handleEvents () {
    this.downloader.on('progress', (stats: any) => {
      console.log('downloadProgress', this.serverId, {
        progress: stats.progressTotal
      })
      send(Events.DOWNLOAD_PROGRESS, this.serverId, {
        progress: stats.progressTotal
      })
    })

    this.downloader.on('end', () => {
      console.log('download ended', this.serverId)

      send(Events.DOWNLOAD_ENDED, this.serverId)

      DownloaderController.remove(this.serverId)
    })

    this.downloader.on('stop', () => {
      console.log('download stoped', this.serverId)

      send(Events.DOWNLOAD_STOPPED, this.serverId)

      DownloaderController.remove(this.serverId)
    })

    this.downloader.on('error', (e: any) => {
      send(Events.ERROR, this.serverId, e)

      DownloaderController.remove(this.serverId)
    })
  }
}
