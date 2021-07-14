import GameModuleProtocol from '../../shared/comunication/module/GameModuleProtocol'
import { GameModule as BaseGameModule } from '../../sdk/Sdk'
import ModPack from '../../sdk/definitions/ModPack'
import DownloaderProtocol from '../../shared/comunication/downloader/DownloaderProtocol'
import DownloaderController from '../downloaders/DownloaderController'
import Downloader from './Downloader'

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

  createDownloader (serverId: string, modPacks: ModPack[]): Promise<any> {
    console.log('creating downloader for serverId', serverId)

    if (DownloaderController.has(serverId)) {
      console.log('A downloader is already created for this server', serverId)
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject<string>('A downloader is already created for this server')
    }

    const downloader = this.gameModule.createDownloader(modPacks)

    DownloaderController.add(serverId, new Downloader(serverId, downloader))

    return Promise.resolve('ok')
  }
}
