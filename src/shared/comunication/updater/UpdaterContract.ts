import { UpdateInfo } from 'electron-updater'

export enum UpdaterEvents {
  UPDATE_DETECTED = 'updater.newUpdateDetected',
}

export interface UpdaterContract {
  newVersion: UpdateInfo|null
  version: string
  isUpdateAvailable: boolean

  checkForUpdate(): Promise<boolean>
  processUpdate(): Promise<void>
}
