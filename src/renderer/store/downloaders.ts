import { Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { DownloaderState } from '@emodyz/node-downloader'
import { DownloaderEvents } from '../../shared/contracts/comunication/downloader/DownloaderContract'
import { DownloaderControllerEvents } from '../../shared/contracts/comunication/downloader/DownloaderControllerContract'
import { updaterStore } from '~/store'
import Downloader from '~/comunication/Downloader'
import DownloaderController from '~/comunication/DownloaderController'

interface StoreDownloaderState {
  serverId: any,
  downloader: Downloader
  hidden: boolean,
  state: DownloaderState,
  progress: number
}

@Module({
  name: 'downloaders',
  stateFactory: false,
  namespaced: true
})
export default class Downloaders extends VuexModule {
  downloaders: StoreDownloaderState[] = []

  constructor (module) {
    super(module)
    const controller = new DownloaderController()

    // When window is reloaded, fetch backend queuedDownloaders to reinstate downloader list
    controller.queuedDownloaders()
      .then(downloaders => {
        for (const downloader of downloaders) {
          this.newDownloader(
            downloader.serverId,
            downloader.state,
            downloader.progress
          )
        }
      })

    controller.on(DownloaderControllerEvents.CREATED, (serverId: string) => {
      this.newDownloader(serverId)
    })

    controller.on(DownloaderControllerEvents.DELETED, (serverId: string) => {
      this.deleteDownloader(serverId)
    })
  }

  newDownloader (
    serverId: string,
    state: DownloaderState = DownloaderState.STAND_BY,
    progress: number = 0
  ) {
    updaterStore.remove(serverId)
    const downloader = new Downloader(serverId)

    this.handleDownloaderEvents(downloader)
    this.downloaders.push({
      serverId,
      downloader,
      hidden: false,
      state,
      progress
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

  get downloaderByServer () {
    return (serverId: string) => {
      const index = this.downloaders.map(downloader => downloader.serverId).indexOf(serverId)
      return this.downloaders[index]
    }
  }

  get progressByServer () {
    return (serverId: string) => {
      const index = this.downloaders.map(downloader => downloader.serverId).indexOf(serverId)
      return this.downloaders[index]?.progress || 0
    }
  }

  get findDownloader (): (serverId: string) => (StoreDownloaderState | null) {
    return (serverId: string) => {
      const index = this.downloaders.map(downloader => downloader.serverId).indexOf(serverId)
      if (index !== -1) {
        return this.downloaders[index]
      }
      return null
    }
  }

  @Mutation
  hide (serverId: string) {
    const index = this.downloaders.map(downloader => downloader.serverId).indexOf(serverId)
    if (index !== -1) {
      this.downloaders[index].hidden = true
    }
  }

  @Mutation
  hideAll () {
    const list = this.downloaders
    for (const item of list) {
      item.hidden = true
    }
    this.downloaders = list
  }

  @Mutation
  showAll () {
    const list = this.downloaders
    for (const item of list) {
      item.hidden = false
    }
    this.downloaders = list
  }

  @Mutation
  deleteDownloader (serverId: string) {
    const index = this.downloaders.map(downloader => downloader.serverId).indexOf(serverId)
    if (index !== -1) {
      const downloaderState = this.downloaders.splice(index, 1)
      downloaderState[0].downloader.destroy()
    }
  }

  @Mutation
  setDownloaderProgress ({ serverId, progress }: {serverId: string, progress: number}) {
    const index = this.downloaders.map(downloader => downloader.serverId).indexOf(serverId)
    if (index !== -1) {
      this.downloaders[index].progress = progress
    }
  }

  @Mutation
  setDownloaderState ({ serverId, state }: {serverId: string, state: number}) {
    const index = this.downloaders.map(downloader => downloader.serverId).indexOf(serverId)
    if (index !== -1) {
      this.downloaders[index].state = state
    }
  }
}
