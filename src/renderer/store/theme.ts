import { Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { ipcRenderer } from 'electron'
import { themeStore } from '~/store'

@Module({
  name: 'theme',
  stateFactory: true,
  namespaced: true
})
export default class Theme extends VuexModule {
  uuid: string = ''
  themeSource: 'system' | 'dark' | 'light' = 'system';

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcRenderer.once('theme.updated', (event, args) => {
      console.log('updated -> ', args)
      themeStore.forceUpdate()
      this.handleSystemChange()
    })
  }
}
