import { Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { UpdateInfo, AppUpdaterEvents } from '../../shared/contracts/comunication/updater/AppUpdaterContract'
// eslint-disable-next-line import/no-named-default
import { default as BaseAppUpdater } from '@/comunication/AppUpdater'
import { appUpdaterStore } from '@/store'

let updater: BaseAppUpdater

@Module({
  name: 'appUpdater',
  stateFactory: false,
  namespaced: true
})
export default class AppUpdater extends VuexModule {
  currentVersion: string
  updateInfo: UpdateInfo|null
  isUpdateAvailable: boolean
  isUpdateInProgress!: boolean

  constructor (props) {
    super(props)

    updater = new BaseAppUpdater()

    this.currentVersion = updater.version
    this.isUpdateAvailable = updater.isUpdateAvailable
    this.updateInfo = updater.updateInfo

    updater.isUpdateInProgressSync.subscribe(status => {
      if (this.isUpdateInProgress === undefined) {
        this.isUpdateInProgress = status
      } else {
        appUpdaterStore.isUpdateInProgressChanged(status)
      }
    })

    // Cannot call this.newUpdateAvailable, don't know why.
    updater.on(AppUpdaterEvents.UPDATE_AVAILABLE, updateInfo => appUpdaterStore.newUpdateAvailable(updateInfo))
  }

  @Mutation
  isUpdateInProgressChanged (status: boolean) {
    this.isUpdateInProgress = status
  }

  @Mutation
  newUpdateAvailable (updateInfo: UpdateInfo) {
    this.updateInfo = updateInfo
    this.isUpdateAvailable = true
  }

  @Mutation
  async checkForUpdate () {
    return await updater.checkForUpdate()
  }

  @Mutation
  async processUpdate () {
    return await updater.processUpdate()
  }
}
