import GameModuleContract from '../../shared/comunication/module/GameModuleContract'
import { GameModule as BaseGameModule } from '../../sdk/Sdk'
import ModPack from '../../sdk/definitions/ModPack'
import MainDownloaderController from '../downloaders/MainDownloaderController'
import MainCommunicator from '../../shared/communicator/main/MainCommunicator'
import { Communicator } from '../../shared/communicator/main/Communicator'
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

  checkGamePath (gamePath: string): Promise<boolean> {
    return Promise.resolve(this.gameModule.checkGamePath(gamePath))
  }

  createDownloader (serverId: string, modPacks: ModPack[]): Promise<any> {
    console.log('creating downloader for serverId', serverId)

    if (MainDownloaderController.get().has(serverId)) {
      console.log('A downloader is already created for this server', serverId)
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject<string>('A downloader is already created for this server')
    }

    const downloader = this.gameModule.createDownloader(modPacks)

    MainDownloaderController.get().add(serverId, new MainDownloader(serverId, downloader))

    return Promise.resolve('ok')
  }
}
