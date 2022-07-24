export enum DownloaderEvents {
  ERROR = 'downloader.error',
  DOWNLOAD_STARTED = 'downloader.started',
  DOWNLOAD_STOPPED = 'downloader.stopped',
  DOWNLOAD_PAUSED = 'downloader.paused',
  DOWNLOAD_RESUMED = 'downloader.resumed',
  DOWNLOAD_PROGRESS = 'downloader.progress',
  DOWNLOAD_ENDED = 'downloader.ended',
}

export default interface DownloaderContract {

  start(forceDownload?: boolean): Promise<void>

  stop(): Promise<void>

  pause(): Promise<void>

  resume(): Promise<void>
}
