import { Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { DownloaderState } from '@emodyz/node-downloader'
import { DownloaderEvents } from '../../shared/comunication/downloader/DownloaderContract'
import { DownloaderControllerEvents } from '../../shared/comunication/downloader/DownloaderControllerContract'
import { updaterStore } from '~/store'
import Downloader from '~/comunication/Downloader'
import DownloaderController from '~/comunication/DownloaderController'

interface StoreDownloaderState {
  serverId: any,
  downloader: Downloader
  hidden: boolean,
  state: number,
  progress: number
}

@Module({
  name: 'downloaders',
  stateFactory: false,
  namespaced: true
})
export default class Downloaders extends VuexModule {
  _downloaders: StoreDownloaderState[] = []

  constructor (module) {
    super(module)
    const controller = new DownloaderController()

    controller.on(DownloaderControllerEvents.CREATED, (serverId: string) => {
      updaterStore.remove(serverId)
      const downloader = new Downloader(serverId)

      this.handleDownloaderEvents(downloader)
      this._downloaders.push({
        serverId,
        downloader,
        hidden: false,
        state: DownloaderState.STAND_BY,
        progress: 0
      })
    })

    controller.on(DownloaderControllerEvents.DELETED, (serverId: string) => {
      this.deleteDownloader(serverId)
    })
  }

  @Mutation
  handleDownloaderEvents (downloader: Downloader) {
    downloader.on(DownloaderEvents.DOWNLOAD_ENDED, (serverId: string) => {
      updaterStore.add(serverId)
    })

    downloader.on(DownloaderEvents.DOWNLOAD_STARTED, (serverId: string) => {
      this.setDownloaderState({ serverId, state: DownloaderState.DOWNLOADING })
    })

    downloader.on(DownloaderEvents.DOWNLOAD_PAUSED, (serverId: string) => {
      this.setDownloaderState({ serverId, state: DownloaderState.PAUSED })
    })

    downloader.on(DownloaderEvents.DOWNLOAD_RESUMED, (serverId: string) => {
      this.setDownloaderState({ serverId, state: DownloaderState.DOWNLOADING })
    })

    downloader.on(DownloaderEvents.DOWNLOAD_PROGRESS, (serverId: string, data) => {
      this.setDownloaderProgress({ serverId, progress: data.progress })
    })

    downloader.on(DownloaderEvents.ERROR, (serverId: string, data) => {
      this.deleteDownloader(serverId)
      console.error(data)
    })
  }

  get downloaders () {
    return this._downloaders
  }

  get downloaderByServer () {
    return (serverId: string) => {
      const index = this._downloaders.map(downloader => downloader.serverId).indexOf(serverId)
      return this._downloaders[index]
    }
  }

  get progressByServer () {
    return (serverId: string) => {
      const index = this._downloaders.map(downloader => downloader.serverId).indexOf(serverId)
      return this._downloaders[index]?.progress || 0
    }
  }

  get findDownloader (): (serverId: string) => (StoreDownloaderState | null) {
    return (serverId: string) => {
      const index = this._downloaders.map(downloader => downloader.serverId).indexOf(serverId)
      if (index !== -1) {
        return this._downloaders[index]
      }
      return null
    }
  }

  @Mutation
  hide (serverId: string) {
    const index = this._downloaders.map(downloader => downloader.serverId).indexOf(serverId)
    if (index !== -1) {
      this._downloaders[index].hidden = true
    }
  }

  @Mutation
  hideAll () {
    const list = this._downloaders
    for (const item of list) {
      item.hidden = true
    }
    this._downloaders = list
  }

  @Mutation
  showAll () {
    const list = this._downloaders
    for (const item of list) {
      item.hidden = false
    }
    this._downloaders = list
  }

  @Mutation
  deleteDownloader (serverId: string) {
    const index = this._downloaders.map(downloader => downloader.serverId).indexOf(serverId)
    if (index !== -1) {
      const downloaderState = this._downloaders.splice(index, 1)
      downloaderState[0].downloader.destroy()
    }
  }

  @Mutation
  setDownloaderProgress ({ serverId, progress }: {serverId: string, progress: number}) {
    const index = this._downloaders.map(downloader => downloader.serverId).indexOf(serverId)
    if (index !== -1) {
      this._downloaders[index].progress = progress
    }
  }

  @Mutation
  setDownloaderState ({ serverId, state }: {serverId: string, state: number}) {
    const index = this._downloaders.map(downloader => downloader.serverId).indexOf(serverId)
    if (index !== -1) {
      this._downloaders[index].state = state
    }
  }
}
