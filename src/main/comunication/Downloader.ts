import DownloaderContract, { DownloaderEvents } from '../../shared/comunication/downloader/DownloaderContract'
import { Downloader as BaseDownloader } from '../../sdk/Sdk'
import DownloaderController from '../downloaders/DownloaderController'
import { send } from '../helpers/events'

export default class Downloader implements DownloaderContract {
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

    send(DownloaderEvents.DOWNLOAD_PAUSED, this.serverId)

    return Promise.resolve()
  }

  resume (): Promise<void> {
    return this.downloader.resume()
      .then(() => {
        send(DownloaderEvents.DOWNLOAD_RESUMED, this.serverId)
      })
  }

  start (forceDownload: boolean = false): Promise<void> {
    return this.downloader.start(forceDownload)
      .then(() => {
        send(DownloaderEvents.DOWNLOAD_STARTED, this.serverId)
      }).catch((e: any) => {
        send(DownloaderEvents.ERROR, this.serverId, e)
        DownloaderController.remove(this.serverId)
      })
  }

  stop (): Promise<void> {
    this.downloader.stop()

    send(DownloaderEvents.DOWNLOAD_STOPPED, this.serverId)

    return Promise.resolve()
  }

  handleEvents () {
    this.downloader.on('progress', (stats: any) => {
      console.log('downloadProgress', this.serverId, {
        progress: stats.progressTotal
      })
      send(DownloaderEvents.DOWNLOAD_PROGRESS, this.serverId, {
        progress: stats.progressTotal
      })
    })

    this.downloader.on('end', () => {
      console.log('download ended', this.serverId)

      send(DownloaderEvents.DOWNLOAD_ENDED, this.serverId)

      DownloaderController.remove(this.serverId)
    })

    this.downloader.on('stop', () => {
      console.log('download stoped', this.serverId)

      send(DownloaderEvents.DOWNLOAD_STOPPED, this.serverId)

      DownloaderController.remove(this.serverId)
    })

    this.downloader.on('error', (e: any) => {
      send(DownloaderEvents.ERROR, this.serverId, e)

      DownloaderController.remove(this.serverId)
    })
  }
}
