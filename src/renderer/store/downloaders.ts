import {Module, Mutation, VuexModule} from 'vuex-module-decorators'

import {downloadersStore, updaterStore} from "~/store";

interface Downloader {
  server: any,
  downloader: any,
  hidden: boolean,
  progress: number
}

@Module({
  name: 'downloaders',
  stateFactory: true,
  namespaced: true
})
export default class Downloaders extends VuexModule {

  list: Downloader[] = [];

  get downloaders () {
    return this.list
  }

  get downloaderByServer() {
    return (serverId: string) => {
      const index = this.list.map(downloader => downloader.server.id).indexOf(serverId)
      return this.list[index]?.downloader
    }
  }
  get progressByServer() {
    return (serverId: string) => {
      const index = this.list.map(downloader => downloader.server.id).indexOf(serverId)
      return this.list[index]?.progress || 0
    }
  }

  get findServerInstance (): (serverId: string) => any | null {
    return (serverId: string) => {
      const downloader = this.findDownloader(serverId)
      if (downloader) {
        return downloader.server
      }
      return null
    }
  }

  get findDownloaderInstance (): (serverId: string) => any | null {
    return (serverId: string) => {
      const downloader = this.findDownloader(serverId)
      if (downloader) {
        return downloader.downloader
      }
      return null
    }
  }

  get findDownloader (): (serverId: string) => Downloader | null {
    return (serverId: string) => {
      const index = this.list.map(downloader => downloader.server.id).indexOf(serverId)
      if (index !== -1) {
        return this.list[index]
      }
      return null
    }
  }

  @Mutation
  add({server, downloader}) {
    this.list.push({
      server: server,
      downloader: downloader,
      hidden: false,
      progress: 0
    })
  }

  @Mutation
  remove (serverId: string) {
    this.deleteDownloader(serverId)
  }

  @Mutation
  start({serverId, forceDownload = false}) {
    const downloader = downloadersStore.findDownloader(serverId)

    if (downloader) {
      if (downloader.downloader.stats().files === 0) {
        console.log('no files to download')
        downloadersStore.deleteDownloader(serverId)
        return
      }

      downloader.downloader.on('progress', stats => {
        downloadersStore.setDownloaderProgress({
          serverId: serverId,
          progress: stats.progressTotal
        })
        console.log(stats.progressTotal)
      })

      downloader.downloader.on('end', () => {
        updaterStore.add(downloader.server)
        downloadersStore.deleteDownloader(serverId)
      })

      downloader.downloader.on('stop', () => {
        downloadersStore.deleteDownloader(serverId)
      })

      downloader.downloader.start(forceDownload)
    }
  }

  @Mutation
  pause (serverId) {
    const downloader = downloadersStore.findDownloaderInstance(serverId)
    if (downloader) {
      downloader.pause()
    }
  }

  @Mutation
  stop (serverId) {
    const downloader = downloadersStore.findDownloaderInstance(serverId)
    if (downloader) {
      downloader.stop()
    }
  }

  @Mutation
  resume (serverId) {
    const downloader = downloadersStore.findDownloaderInstance(serverId)
    if (downloader) {
      downloader.resume()
    }
  }

  @Mutation
  deleteDownloader (serverId: string) {
    const index = this.list.map(downloader => downloader.server.id).indexOf(serverId)
    if (index !== -1) {
      this.list.splice(index, 1)
    }
  }

  @Mutation
  setDownloaderProgress({serverId, progress}) {
    const index = this.list.map(downloader => downloader.server.id).indexOf(serverId)
    if (index !== -1) {
      this.list[index].progress = progress
    }
  }
}
