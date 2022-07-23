import { Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { UpdateInfo, UpdaterEvents } from '../../shared/comunication/updater/UpdaterContract'
import Updater from '~/comunication/Updater'
import { appUpdater } from '~/store'

let updater: Updater

@Module({
  name: 'appUpdater',
  stateFactory: false,
  namespaced: true
})
export default class AppUpdater extends VuexModule {
  currentVersion: string // TODO: Make private and add getter
  updateInfo: UpdateInfo|null // TODO: Make private and add getter
  _isUpdateAvailable: boolean

  get isUpdateAvailable () {
    return this._isUpdateAvailable
  }

  constructor (props) {
    super(props)

    updater = new Updater()

    this.currentVersion = updater.version
    this._isUpdateAvailable = updater.isUpdateAvailable
    this.updateInfo = updater.updateInfo

    updater.on(UpdaterEvents.UPDATE_AVAILABLE, updateInfo => appUpdater.newUpdateAvailable(updateInfo))
  }

  @Mutation
  newUpdateAvailable (updateInfo: UpdateInfo) {
    this.updateInfo = updateInfo
    this._isUpdateAvailable = true
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
