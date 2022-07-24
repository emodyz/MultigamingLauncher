import RendererCommunicator from '../../shared/communicator/renderer/RendererCommunicator'
import { Communicator } from '../../shared/communicator/renderer/Communicator'
import DownloaderControllerContract, {
  DownloaderControllerEvents
} from '../../shared/contracts/comunication/downloader/DownloaderControllerContract'
import MainDownloaderController from '../../main/communicator/MainDownloaderController'

@RendererCommunicator('downloader.controller', MainDownloaderController)
// eslint-disable-next-line max-len
export default class DownloaderController extends Communicator<DownloaderControllerContract, DownloaderControllerEvents> {
}
