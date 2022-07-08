import GameModuleContract from '../../shared/comunication/module/GameModuleContract'
import ModPack from '../../sdk/definitions/ModPack'
import DownloaderContract from '../../shared/comunication/downloader/DownloaderContract'
import { Communicator } from '../../shared/communicator/renderer/Communicator'
import RendererCommunicator from '../../shared/communicator/renderer/RendererCommunicator'
import MainGameModule from '../../main/comunication/MainGameModule'
import Downloader from '~/comunication/Downloader'

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

  async createDownloader (serverId: string, modPacks: ModPack[]): Promise<DownloaderContract> {
    const downloader = await this.call('createDownloader', serverId, modPacks)

    console.log(downloader)

    return new Downloader(serverId)
  }

  get downloader (): (serverId: string) => Downloader {
    return (serverId: string) => {
      return new Downloader(serverId)
    }
  }
}
