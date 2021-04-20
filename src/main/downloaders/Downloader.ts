// import { Downloader as NodeDownloader } from '@emodyz/node-downloader'

export default class Downloader {
  private id: string;
  private downloader: any// NodeDownloader;

  constructor (id: string, downloader: any /* NodeDownloader */) {
    this.id = id
    this.downloader = downloader
  }

  async start (forceDownload = false): Promise<void> {
    return await this.downloader.start(forceDownload)
  }

  stop (): any {
    return this.downloader.stop()
  }

  pause (): any {
    return this.downloader.pause()
  }

  resume (): any {
    return this.downloader.resume()
  }

  handleEvents () {
    this.downloader.on('progress', (stats: any) => {
      console.log('progress', stats.progressTotal)
    })

    this.downloader.on('end', () => {
      console.log('end')
    })

    this.downloader.on('stop', () => {
      console.log('stop')
    })
  }
}
