import { DownloaderState } from '@emodyz/node-downloader'

export enum DownloaderControllerEvents {
  CREATED = 'downloader.created',
  DELETED = 'downloader.deleted'
}

export interface QueuedDownloader {
  serverId: string
  state: DownloaderState
  progress: number
}

export default interface DownloaderControllerContract {

  queuedDownloaders(): Promise<QueuedDownloader[]>
}
