import { ipcRenderer } from 'electron'

export default class GameModule { // TODO:  NEED INTERFACE FOR BACK AND FRONT
  gameIdentifier: string;

  constructor (gameIdentifier: string) {
    this.gameIdentifier = gameIdentifier
  }

  async exist () {
    return await ipcRenderer.invoke('module.exist', this.gameIdentifier)
  }

  async validateGamePath (gamePath: string | null) {
    if (gamePath === null) {
      console.log('gamePath null for', this.gameIdentifier)
      return Promise.resolve(false)
    }

    return await ipcRenderer.invoke('module.validateGamePath', this.gameIdentifier, gamePath)
  }

  async findGamePath () {
    return await ipcRenderer.invoke('module.findGamePath', this.gameIdentifier)
  }

  async isGameRunning () {
    return await ipcRenderer.invoke('module.isGameRunning', this.gameIdentifier)
  }
}
