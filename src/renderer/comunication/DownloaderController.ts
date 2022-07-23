import RendererCommunicator from '../../shared/communicator/renderer/RendererCommunicator'
import { Communicator } from '../../shared/communicator/renderer/Communicator'
import DownloaderControllerContract, {
  DownloaderControllerEvents
} from '../../shared/comunication/downloader/DownloaderControllerContract'
import MainDownloaderController from '../../main/downloaders/MainDownloaderController'

// @todo see why the controller is instantiate two times by the front

@RendererCommunicator('downloader.controller', MainDownloaderController)
// eslint-disable-next-line max-len
export default class DownloaderController extends Communicator<DownloaderControllerContract, DownloaderControllerEvents> {
}
