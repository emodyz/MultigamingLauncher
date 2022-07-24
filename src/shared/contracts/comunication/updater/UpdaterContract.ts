export type UpdateInfo = {
  version: string;
  releaseDate: string;
  releaseName?: string | null;
  releaseNotes?: string;
}

export enum UpdaterEvents {
  UPDATE_AVAILABLE = 'updater.newUpdateAvailable',
}

export interface UpdaterContract {
  updateInfo: UpdateInfo|null
  version: string
  isUpdateAvailable: boolean

  checkForUpdate(): Promise<boolean>
  processUpdate(): Promise<void>
}
