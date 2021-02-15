import { Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { remote } from 'electron'
import { themeStore } from '~/utils/store-accessor'

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
    remote.nativeTheme.themeSource = themeSource
  }

  @Mutation
  forceUpdate () {
    this.uuid = Math.random().toString(36).substring(7)
  }

  @Mutation
  syncTheme () {
    remote.nativeTheme.themeSource = this.themeSource
  }

  get isDark () {
    if (this.themeSource === 'system') {
      return this.uuid.length >= 0 && remote.nativeTheme.shouldUseDarkColors
    }

    return this.themeSource === 'dark'
  }

  constructor (props) {
    super(props)
    this.handleSystemChange()
  }

  handleSystemChange () {
    remote.nativeTheme.once('updated', () => {
      themeStore.forceUpdate()
      this.handleSystemChange()
    })
  }
}
