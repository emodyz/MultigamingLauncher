import RendererCommunicator from '../../shared/communicator/renderer/RendererCommunicator'
import MainUpdater from '../../main/comunication/MainUpdater'
import { UpdaterContract, UpdaterEvents } from '../../shared/comunication/updater/UpdaterProtocol'
import { Communicator } from '../../shared/communicator/renderer/Communicator'

@RendererCommunicator('updater', MainUpdater)
export default class RendererUpdater extends Communicator<UpdaterContract, UpdaterEvents> {
  test () {
    this.on(UpdaterEvents.UPDATE_DETECTED, () => {
      console.log('update detected')
    })
  }
}
