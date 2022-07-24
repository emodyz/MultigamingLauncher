import { nativeTheme } from 'electron'
import { Communicator } from '../../shared/communicator/main/Communicator'
import MainCommunicator from '../../shared/communicator/main/MainCommunicator'
import ThemeContract, { ThemeSource } from '../../shared/contracts/comunication/theme/ThemeContract'
import Cache from '../facades/Cache'

@MainCommunicator('theme')
export default class MainTheme extends Communicator implements ThemeContract {
  shouldUseDarkColors: boolean = nativeTheme.shouldUseDarkColors
  themeSource: ThemeSource = nativeTheme.themeSource

  constructor () {
    super()

    if (Cache.has('nativeTheme.themeSource')) {
      nativeTheme.themeSource = Cache.get('nativeTheme.themeSource')
    }

    nativeTheme.on('updated', () => {
      this.themeSource = nativeTheme.themeSource
      this.shouldUseDarkColors = nativeTheme.shouldUseDarkColors
    })
  }

  async setThemeSource (themeSource: ThemeSource) {
    if (themeSource) {
      nativeTheme.themeSource = themeSource
    }
    Cache.set('nativeTheme.themeSource', themeSource)
    return nativeTheme.themeSource
  }
}
