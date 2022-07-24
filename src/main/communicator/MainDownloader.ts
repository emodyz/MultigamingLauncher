import DownloaderContract, { DownloaderEvents } from '../../shared/contracts/comunication/downloader/DownloaderContract'
import { Downloader as BaseDownloader } from '../../sdk/Sdk'
import MainCommunicator from '../../shared/communicator/main/MainCommunicator'
import { Communicator } from '../../shared/communicator/main/Communicator'
import MainDownloaderController from './MainDownloaderController'

@MainCommunicator('downloader')
export default class MainDownloader extends Communicator<DownloaderEvents> implements DownloaderContract {
  serverId: string
  downloader: BaseDownloader

  constructor (serverId: string, downloader: BaseDownloader) {
    super()
    this.uniqIdentifier = serverId
    this.serverId = serverId
    this.downloader = downloader

    this.handleEvents()
  }

  pause (): Promise<void> {
    this.downloader.pause()

    this.trigger(DownloaderEvents.DOWNLOAD_PAUSED, this.serverId)

    return Promise.resolve()
  }

  resume (): Promise<void> {
    return this.downloader.resume()
      .then(() => {
        this.trigger(DownloaderEvents.DOWNLOAD_RESUMED, this.serverId)
      })
  }

  start (forceDownload: boolean = false): Promise<void> {
    return this.downloader.start(forceDownload)
      .then(() => {
        this.trigger(DownloaderEvents.DOWNLOAD_STARTED, this.serverId)
      }).catch((e: any) => {
        this.trigger(DownloaderEvents.ERROR, this.serverId, e)
        MainDownloaderController.get().remove(this.serverId)
      })
  }

  stop (): Promise<void> {
    this.downloader.stop()

    this.trigger(DownloaderEvents.DOWNLOAD_STOPPED, this.serverId)

    return Promise.resolve()
  }

  handleEvents () {
    this.downloader.on('progress', (stats: any) => {
      this.trigger(DownloaderEvents.DOWNLOAD_PROGRESS, this.serverId, {
        progress: stats.progressTotal
      })
    })

    this.downloader.on('end', () => {
      this.trigger(DownloaderEvents.DOWNLOAD_ENDED, this.serverId)

      MainDownloaderController.get().remove(this.serverId)
    })

    this.downloader.on('stop', () => {
      this.trigger(DownloaderEvents.DOWNLOAD_STOPPED, this.serverId)

      MainDownloaderController.get().remove(this.serverId)
    })

    this.downloader.on('error', (e: any) => {
      this.trigger(DownloaderEvents.ERROR, this.serverId, e)

      MainDownloaderController.get().remove(this.serverId)
    })
  }
}
