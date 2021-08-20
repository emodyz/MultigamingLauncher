import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { ipcRenderer } from 'electron'
import { Events } from '../../shared/comunication/downloader/DownloaderProtocol'
import { DownloaderState } from '../../sdk/Sdk'
import { updaterStore } from '~/store'

interface Downloader {
  serverId: any,
  hidden: boolean,
  state: number,
  progress: number
}

@Module({
  name: 'downloaders',
  stateFactory: true,
  namespaced: true
})
export default class Downloaders extends VuexModule {
  list: Downloader[] = [];

  constructor (props) {
    super(props)

    ipcRenderer.invoke('downloaders').then((downloaders: any) => {
      console.log('serversIds downloader', downloaders)
      downloaders.forEach(downloader => {
        this.list.push({
          serverId: downloader.serverId,
          hidden: false,
          state: downloader.state,
          progress: downloader.stats.progress
        })
      })
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcRenderer.on(Events.CREATED, (evt, serverId: string) => {
      updaterStore.remove(serverId)
      this.list.push({
        serverId,
        hidden: false,
        state: DownloaderState.STAND_BY,
        progress: 0
      })
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcRenderer.on(Events.DELETED, (evt, serverId: string) => {
      this.deleteDownloader(serverId)
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcRenderer.on(Events.DOWNLOAD_ENDED, (evt, serverId: string) => {
      updaterStore.add(serverId)
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcRenderer.on(Events.DOWNLOAD_STARTED, (evt, serverId: string) => {
      this.setDownloaderState({ serverId, state: DownloaderState.DOWNLOADING })
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcRenderer.on(Events.DOWNLOAD_PAUSED, (evt, serverId: string) => {
      this.setDownloaderState({ serverId, state: DownloaderState.PAUSED })
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcRenderer.on(Events.DOWNLOAD_RESUMED, (evt, serverId: string) => {
      this.setDownloaderState({ serverId, state: DownloaderState.DOWNLOADING })
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcRenderer.on(Events.DOWNLOAD_PROGRESS, (evt, serverId: string, data) => {
      this.setDownloaderProgress({ serverId, progress: data.progress })
    })
  }

  get downloaders () {
    return this.list
  }

  get downloaderByServer () {
    return (serverId: string) => {
      const index = this.list.map(downloader => downloader.serverId).indexOf(serverId)
      return this.list[index]
    }
  }

  get progressByServer () {
    return (serverId: string) => {
      const index = this.list.map(downloader => downloader.serverId).indexOf(serverId)
      return this.list[index]?.progress || 0
    }
  }

  get findDownloader (): (serverId: string) => Downloader | null {
    return (serverId: string) => {
      const index = this.list.map(downloader => downloader.serverId).indexOf(serverId)
      if (index !== -1) {
        return this.list[index]
      }
      return null
    }
  }

  @Mutation
  hide (serverId: string) {
    const index = this.list.map(downloader => downloader.serverId).indexOf(serverId)
    if (index !== -1) {
      this.list[index].hidden = true
    }
  }

  @Mutation
  hideAll () {
    const list = this.list
    for (const item of list) {
      item.hidden = true
    }
    this.list = list
  }

  @Mutation
  showAll () {
    const list = this.list
    for (const item of list) {
      item.hidden = false
    }
    this.list = list
  }

  @Mutation
  deleteDownloader (serverId: string) {
    const index = this.list.map(downloader => downloader.serverId).indexOf(serverId)
    if (index !== -1) {
      this.list.splice(index, 1)
    }
  }

  @Mutation
  setDownloaderProgress ({ serverId, progress }: {serverId: string, progress: number}) {
    const index = this.list.map(downloader => downloader.serverId).indexOf(serverId)
    if (index !== -1) {
      this.list[index].progress = progress
    }
  }

  @Mutation
  setDownloaderState ({ serverId, state }: {serverId: string, state: number}) {
    const index = this.list.map(downloader => downloader.serverId).indexOf(serverId)
    if (index !== -1) {
      this.list[index].state = state
    }
  }
}
