import DownloaderContract, { DownloaderEvents } from '../../shared/comunication/downloader/DownloaderContract'
import RendererCommunicator from '../../shared/communicator/renderer/RendererCommunicator'
import { Communicator } from '../../shared/communicator/renderer/Communicator'
import MainDownloader from '../../main/comunication/MainDownloader'

@RendererCommunicator('downloader', MainDownloader)
export default class Downloader extends Communicator<DownloaderContract, DownloaderEvents> {
  constructor (serverId: string) {
    super()
    this.uniqIdentifier = serverId
  }
}
