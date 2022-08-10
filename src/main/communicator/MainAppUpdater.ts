import { autoUpdater } from 'electron-updater'
import {
  UpdateInfo,
  AppUpdaterContract,
  AppUpdaterEvents
} from '../../shared/contracts/comunication/updater/AppUpdaterContract'
import MainCommunicator from '../../shared/communicator/main/MainCommunicator'
import { Communicator } from '../../shared/communicator/main/Communicator'

@MainCommunicator('appUpdater')
export default class MainAppUpdater extends Communicator<AppUpdaterEvents> implements AppUpdaterContract {
  updateInfo: UpdateInfo|null = null
  version: string = autoUpdater.currentVersion.version

  isUpdateAvailable: boolean = false
  isUpdateInProgress: boolean = false

  constructor () {
    super()

    // Setup autoUpdater config
    autoUpdater.autoDownload = false

    autoUpdater.on('update-available', updateInfo => {
      const customUpdateInfo: UpdateInfo = {
        version: updateInfo.version,
        releaseName: updateInfo.releaseName,
        releaseNotes: typeof updateInfo?.releaseNotes === 'string'
          ? updateInfo?.releaseNotes
          // eslint-disable-next-line max-len
          : 'Type of Release note not supported, please create an issue if you see this message https://github.com/emodyz/MultigamingLauncher/issues', // TODO: Handle ReleaseNoteInfo[] type ?
        releaseDate: updateInfo.releaseDate
      }

      this.updateInfo = customUpdateInfo
      this.isUpdateAvailable = true
      this.trigger(AppUpdaterEvents.UPDATE_AVAILABLE, customUpdateInfo)
    })

    autoUpdater.on('update-downloaded', async () => {
      this.isUpdateInProgress = false

      await autoUpdater.quitAndInstall()
    })

    autoUpdater.on('error', error => {
      console.error(error)
      if (this.isUpdateInProgress) {
        this.isUpdateInProgress = false
      }
    })

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
    await autoUpdater.checkForUpdates()

    return this.isUpdateAvailable
  }

  async processUpdate (): Promise<void> {
    if (!this.isUpdateAvailable) {
      throw new Error('processUpdate: called too early, no version available')
    }

    if (this.isUpdateInProgress) {
      throw new Error('processUpdate: updater already in progress')
    }

    this.isUpdateInProgress = true

    await autoUpdater.downloadUpdate()
  }
}
