import DownloaderContract, { DownloaderEvents } from '../../shared/contracts/comunication/downloader/DownloaderContract'
import RendererCommunicator from '../../shared/communicator/renderer/RendererCommunicator'
import { Communicator } from '../../shared/communicator/renderer/Communicator'
import MainDownloader from '../../main/communicator/MainDownloader'

@RendererCommunicator('downloader', MainDownloader)
export default class Downloader extends Communicator<DownloaderContract, DownloaderEvents> {
  constructor (serverId: string) {
    super()
    this.uniqIdentifier = serverId
  }
}
