import { ipcMain } from 'electron'
import Arma3 from '../modules/arma3/main'
import GameModule from '../comunication/GameModule'
import { Channels } from '../../shared/comunication/module/GameModuleProtocol'
import ModPack from '../../sdk/definitions/ModPack'

export default class ModuleController {
  private readonly modules = new Map<string, GameModule>([
    ['arma3', new GameModule(new Arma3())]
    // ['minecraft', new GameModule(new Arma3())]
  ])

  init () {
    this.handleEvents()
  }

  private handleEvents () {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcMain.handle(Channels.EXIST, (event, identifier: string) => {
      if (!this.modules.has(identifier)) {
        return false
      }
      return true
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcMain.handle(Channels.VALIDE_GAME_PATH, (event, identifier: string, path: string) => {
      return this.modules.get(identifier).validateGamePath(path)
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcMain.handle(Channels.FIND_GAME_PATH, (event, identifier: string) => {
      return this.modules.get(identifier).findGamePath()
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcMain.handle(Channels.IS_GAME_RUNNING, (event, identifier: string) => {
      return this.modules.get(identifier).isGameRunning()
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcMain.handle(Channels.CREATE_DOWNLOADER, (event, identifier: string, serverId: string, modPacks: ModPack[]) => {
      return this.modules.get(identifier).createDownloader(serverId, modPacks)
    })
  }
}
