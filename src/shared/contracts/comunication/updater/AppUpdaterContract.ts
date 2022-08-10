export type UpdateInfo = {
  version: string;
  releaseDate: string;
  releaseName?: string | null;
  releaseNotes?: string;
}

export enum AppUpdaterEvents {
  UPDATE_AVAILABLE = 'updater.newUpdateAvailable',
}

export interface AppUpdaterContract {
  updateInfo: UpdateInfo|null
  version: string

  isUpdateAvailable: boolean
  isUpdateInProgress: boolean

  checkForUpdate(): Promise<boolean>
  processUpdate(): Promise<void>
}
