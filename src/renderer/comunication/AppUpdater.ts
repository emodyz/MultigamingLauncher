import RendererCommunicator from '../../shared/communicator/renderer/RendererCommunicator'
import MainAppUpdater from '../../main/communicator/MainAppUpdater'
import { AppUpdaterContract, AppUpdaterEvents } from '../../shared/contracts/comunication/updater/AppUpdaterContract'
import { Communicator } from '../../shared/communicator/renderer/Communicator'

@RendererCommunicator('appUpdater', MainAppUpdater)
export default class AppUpdater extends Communicator<AppUpdaterContract, AppUpdaterEvents> {
}
