import { ipcRenderer } from 'electron'
import GameModuleProtocol, { Channels } from '../../shared/comunication/module/GameModuleProtocol'
import ModPack from '../../sdk/definitions/ModPack'
import DownloaderProtocol from '../../shared/comunication/downloader/DownloaderProtocol'
import Downloader from '~/comunication/Downloader'

export default class GameModule implements GameModuleProtocol {
  gameIdentifier: string

  constructor (gameIdentifier: string) {
    this.gameIdentifier = gameIdentifier
  }

  async exist (): Promise<boolean> {
    return await this.emit(Channels.EXIST)
  }

  async findGamePath (): Promise<string | null> {
    return await this.emit(Channels.FIND_GAME_PATH)
  }

  async isGameRunning (): Promise<boolean> {
    return await this.emit(Channels.IS_GAME_RUNNING)
  }

  async validateGamePath (gamePath: string): Promise<boolean> {
    if (gamePath === null) {
      console.log('no gamePath provided for', this.gameIdentifier)
      return false
    }

    return await this.emit(Channels.VALIDE_GAME_PATH, gamePath)
  }

  async createDownloader (serverId: string, modPacks: ModPack[]): Promise<DownloaderProtocol> {
    await this.emit(Channels.CREATE_DOWNLOADER, serverId, modPacks)

    return new Downloader(serverId)
  }

  get downloader (): (serverId: string) => Downloader {
    return (serverId: string) => {
      return new Downloader(serverId)
    }
  }

  /**
   * Private methods (helpers)
   */

  private async emit (channel: string, ...data): Promise<any> {
    return await ipcRenderer.invoke(channel, this.gameIdentifier, ...data)
  }
}
