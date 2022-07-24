import MainDownloader from '../comunication/MainDownloader'
import MainCommunicator from '../../shared/communicator/main/MainCommunicator'
import { Communicator } from '../../shared/communicator/main/Communicator'
import DownloaderControllerContract, {
  DownloaderControllerEvents, QueuedDownloader
} from '../../shared/comunication/downloader/DownloaderControllerContract'

@MainCommunicator('downloader.controller')
// eslint-disable-next-line max-len
export default class MainDownloaderController extends Communicator<DownloaderControllerEvents> implements DownloaderControllerContract {
  private static instance: MainDownloaderController
  private downloaders: Map<string, MainDownloader> = new Map<string, MainDownloader>()

  static get (): MainDownloaderController {
    if (!MainDownloaderController.instance) {
      MainDownloaderController.instance = new MainDownloaderController()
    }

    return MainDownloaderController.instance
  }

  public async queuedDownloaders (): Promise<QueuedDownloader[]> {
    return Array.from(this.downloaders.values()).map(downloader => {
      return {
        serverId: downloader.serverId,
        state: downloader.downloader.state,
        progress: downloader.downloader.stats().progress
      }
    })
  }

  public add (serverId: string, downloader: MainDownloader) {
    if (this.has(serverId)) {
      console.error('Downloader already created for this server, aborting the mission...')
      return
    }

    this.trigger(DownloaderControllerEvents.CREATED, serverId)

    this.downloaders.set(serverId, downloader)
  }

  public remove (serverId: string) {
    this.trigger(DownloaderControllerEvents.DELETED, serverId)

    this.get(serverId)?.destroy()

    this.downloaders.delete(serverId)
  }

  public has (serverId: string): boolean {
    return this.downloaders.has(serverId)
  }

  public get (serverId: string) {
    return this.downloaders.get(serverId)
  }
}
