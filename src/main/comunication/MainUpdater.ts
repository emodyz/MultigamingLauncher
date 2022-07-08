import { autoUpdater, UpdateInfo } from 'electron-updater'
import { UpdaterContract, UpdaterEvents } from '../../shared/comunication/updater/UpdaterContract'
import MainCommunicator from '../../shared/communicator/main/MainCommunicator'
import { Communicator } from '../../shared/communicator/main/Communicator'

@MainCommunicator('updater')
export default class MainUpdater extends Communicator<UpdaterEvents> implements UpdaterContract {
  newVersion: UpdateInfo|null = null
  version: string = autoUpdater.currentVersion.version

  isUpdateAvailable: boolean = false

  constructor () {
    super()

    // Setup autoUpdater config
    autoUpdater.autoDownload = false

    this.checkForUpdate()
      .then(isUpdateAvailable => {
        if (!isUpdateAvailable) {
          this.startAutoUpdateChecker()
        }
      })
  }

  private startAutoUpdateChecker () {
    const checkUpdateInterval = setInterval(async () => {
      if (await this.checkForUpdate() === true) {
        clearInterval(checkUpdateInterval)
      }
    }, 5000)
  }

  async checkForUpdate (): Promise<boolean> {
    if (this.isUpdateAvailable) {
      return true
    }

    const response = await autoUpdater.checkForUpdates()

    if (response?.updateInfo) {
      this.newVersion = response.updateInfo
      if (!this.isUpdateAvailable) {
        this.trigger(UpdaterEvents.UPDATE_DETECTED, response.updateInfo)
      }
      this.isUpdateAvailable = true
    }

    return this.isUpdateAvailable
  }

  async processUpdate (): Promise<void> {
    await autoUpdater.downloadUpdate()

    await autoUpdater.quitAndInstall()
  }
}
