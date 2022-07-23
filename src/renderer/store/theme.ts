import { Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { ipcRenderer } from 'electron'
import { themeStore } from '~/store'

@Module({
  name: 'theme',
  stateFactory: false,
  namespaced: true
})
export default class Theme extends VuexModule {
  uuid: string = ''
  themeSource: 'system' | 'dark' | 'light' = 'system'

  get isDark () {
    if (this.themeSource === 'system') {
      return this.uuid.length >= 0 && ipcRenderer.sendSync('theme.shouldUseDarkColors')
    }

    return this.themeSource === 'dark'
  }

  constructor (props) {
    super(props)
    this.handleSystemChange()
  }

  handleSystemChange () {
    ipcRenderer.once('theme.updated', () => {
      themeStore.forceUpdate()
      this.handleSystemChange()
    })
  }

  @Mutation
  setThemeSource (themeSource: 'system' | 'dark' | 'light') {
    this.themeSource = themeSource
    ipcRenderer.invoke('theme.themeSource', themeSource)
  }

  @Mutation
  forceUpdate () {
    this.uuid = Math.random().toString(36).substring(7)
  }

  @Mutation
  syncTheme () {
    ipcRenderer.invoke('theme.themeSource', this.themeSource)
  }
}
