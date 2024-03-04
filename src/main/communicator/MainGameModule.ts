import GameModuleContract from '../../shared/contracts/comunication/module/GameModuleContract'
import { GameModule as BaseGameModule } from '../../sdk/Sdk'
import ModPack from '../../sdk/definitions/ModPack'
import MainCommunicator from '../../shared/communicator/main/MainCommunicator'
import { Communicator } from '../../shared/communicator/main/Communicator'
import Server from '../../renderer/models/server'
import MainDownloaderController from './MainDownloaderController'
import MainDownloader from './MainDownloader'

@MainCommunicator('game.module')
export default class MainGameModule extends Communicator implements GameModuleContract {
  private gameModule: BaseGameModule

  constructor (gameModule: BaseGameModule) {
    super()
    this.uniqIdentifier = gameModule.gameIdentifier
    this.gameModule = gameModule
  }

  findGamePath (): Promise<string | null> {
    return this.gameModule.findGamePath()
  }

  isGameRunning (): Promise<boolean> {
    return this.gameModule.isGameRunning()
  }

  async checkGamePath (gamePath: string): Promise<boolean> {
    return this.gameModule.checkGamePath(gamePath)
  }

  async createDownloader (serverId: string, modPacks: ModPack[]): Promise<void> {
    console.log('creating downloader for serverId', serverId)

    if (MainDownloaderController.get().has(serverId)) {
      console.log('A downloader is already created for this server', serverId)
      // eslint-disable-next-line prefer-promise-reject-errors
      throw new Error('A downloader is already created for this server')
    }

    const downloader = this.gameModule.createDownloader(modPacks)

    MainDownloaderController.get().add(serverId, new MainDownloader(serverId, downloader))
  }

  async play (modPacks: ModPack[], server: Server): Promise<boolean> {
    return await this.gameModule.play(modPacks, server)
  }

  async killGame () {
    return await this.gameModule.killGame()
  }
}
