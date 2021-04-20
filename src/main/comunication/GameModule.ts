import GameModuleProtocol from '../../shared/comunication/modules/GameModuleProtocol'
import { BaseGameModule } from '../../sdk/Sdk'

export default class GameModule implements GameModuleProtocol {
  private gameModule: BaseGameModule

  constructor (gameModule: BaseGameModule) {
    this.gameModule = gameModule
  }

  findGamePath (): Promise<string | null> {
    return this.gameModule.findGamePath()
  }

  isGameRunning (): Promise<boolean> {
    return this.gameModule.isGameRunning()
  }

  validateGamePath (gamePath: string): Promise<boolean> {
    return Promise.resolve(this.gameModule.validateGamePath(gamePath))
  }
}
