export enum Channels {
  START = 'downloader.start',
  STOP = 'downloader.stop',
  PAUSE = 'downloader.pause',
  RESUME = 'downloader.resume',
}

export enum Events {
  CREATED = 'downloader.created',
  DELETED = 'downloader.deleted',
  DOWNLOAD_STARTED = 'downloader.started',
  DOWNLOAD_STOPPED = 'downloader.stopped',
  DOWNLOAD_PAUSED = 'downloader.paused',
  DOWNLOAD_RESUMED = 'downloader.resumed',
  DOWNLOAD_PROGRESS = 'downloader.progress',
  DOWNLOAD_ENDED = 'downloader.ended'
}

export default interface DownloaderProtocol {

  start(forceDownload?: boolean): Promise<void>

  stop(): Promise<void>

  pause(): Promise<void>

  resume(): Promise<void>
}
