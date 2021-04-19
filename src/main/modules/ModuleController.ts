import { ipcMain } from 'electron'
import Arma3 from '../modules/arma3/main'
import Minecraft from '../modules/minecraft/main'
import { GameModule } from '../sdk/GameModule'

export default class ModuleController {
  private readonly modules = new Map<string, GameModule>([
    ['arma3', new Arma3()],
    ['minecraft', new Minecraft()]
  ])

  init () {
    this.handleEvents()
  }

  private handleEvents () {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcMain.handle('module.exist', (event, identifier: string) => {
      if (!this.modules.has(identifier)) {
        return false
      }
      return true
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcMain.handle('module.validateGamePath', (event, identifier: string, path: string) => {
      return this.modules.get(identifier).validateGamePath(path)
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcMain.handle('module.findGamePath', (event, identifier: string) => {
      return this.modules.get(identifier).findGamePath()
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcMain.handle('module.isGameRunning', (event, identifier: string) => {
      return this.modules.get(identifier).isRunning()
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcMain.handle('module.prepareDownload', (event, identifier: string, modpacks: any) => {
      return this.modules.get(identifier).prepareDownload(modpacks)
    })
  }
}
