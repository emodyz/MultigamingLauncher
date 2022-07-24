import RendererCommunicator from '../../shared/communicator/renderer/RendererCommunicator'
import MainUpdater from '../../main/communicator/MainUpdater'
import { UpdaterContract, UpdaterEvents } from '../../shared/contracts/comunication/updater/UpdaterContract'
import { Communicator } from '../../shared/communicator/renderer/Communicator'

@RendererCommunicator('updater', MainUpdater)
export default class Updater extends Communicator<UpdaterContract, UpdaterEvents> {
}
