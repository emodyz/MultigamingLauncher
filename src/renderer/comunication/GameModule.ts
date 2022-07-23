import GameModuleContract from '../../shared/comunication/module/GameModuleContract'
import { Communicator } from '../../shared/communicator/renderer/Communicator'
import RendererCommunicator from '../../shared/communicator/renderer/RendererCommunicator'
import MainGameModule from '../../main/comunication/MainGameModule'

@RendererCommunicator('game.module', MainGameModule)
export default class GameModule extends Communicator<GameModuleContract> {
  constructor (gameIdentifier: string) {
    super()
    this.uniqIdentifier = gameIdentifier
  }

  async checkGamePath (gamePath: string): Promise<boolean> {
    if (gamePath === null) {
      console.log('no gamePath provided for', this.uniqIdentifier)
      return false
    }

    return this.call('checkGamePath', gamePath)
  }
}
