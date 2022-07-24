import { Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { ThemeSource } from '../../shared/contracts/comunication/theme/ThemeContract'
import Theme from '~/comunication/Theme'

const theme = new Theme()

@Module({
  name: 'theme',
  stateFactory: false,
  namespaced: true
})
export default class ThemeStore extends VuexModule {
  themeSource: ThemeSource = theme.themeSource

  get isDark () {
    if (this.themeSource === 'system') {
      return theme.shouldUseDarkColors
    }

    return this.themeSource === 'dark'
  }

  @Mutation
  async setThemeSource (themeSource: ThemeSource) {
    this.themeSource = themeSource
    await theme.setThemeSource(themeSource)
  }
}
