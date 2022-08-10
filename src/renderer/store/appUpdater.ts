import { Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { UpdateInfo, UpdaterEvents } from '../../shared/contracts/comunication/updater/UpdaterContract'
import Updater from '@/comunication/Updater'
import { appUpdaterStore } from '@/store'

let updater: Updater

@Module({
  name: 'appUpdater',
  stateFactory: false,
  namespaced: true
})
export default class AppUpdater extends VuexModule {
  currentVersion: string
  updateInfo: UpdateInfo|null
  isUpdateAvailable: boolean

  constructor (props) {
    super(props)

    updater = new Updater()

    this.currentVersion = updater.version
    this.isUpdateAvailable = updater.isUpdateAvailable
    this.updateInfo = updater.updateInfo

    // Cannot call this.newUpdateAvailable, don't know why.
    updater.on(UpdaterEvents.UPDATE_AVAILABLE, updateInfo => appUpdaterStore.newUpdateAvailable(updateInfo))
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
