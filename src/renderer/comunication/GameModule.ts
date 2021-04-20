import { ipcRenderer } from 'electron'
import GameModuleProtocol from '../../shared/comunication/modules/GameModuleProtocol'

export default class GameModule implements GameModuleProtocol {
  gameIdentifier: string;

  constructor (gameIdentifier: string) {
    this.gameIdentifier = gameIdentifier
  }

  async exist (): Promise<boolean> {
    return await ipcRenderer.invoke('module.exist', this.gameIdentifier)
  }

  async findGamePath (): Promise<string | null> {
    return await ipcRenderer.invoke('module.findGamePath', this.gameIdentifier)
  }

  async isGameRunning (): Promise<boolean> {
    return await ipcRenderer.invoke('module.isGameRunning', this.gameIdentifier)
  }

  async validateGamePath (gamePath: string): Promise<boolean> {
    if (gamePath === null) {
      console.log('gamePath null for', this.gameIdentifier)
      return false
    }

    return await ipcRenderer.invoke('module.validateGamePath', this.gameIdentifier, gamePath)
  }
}
