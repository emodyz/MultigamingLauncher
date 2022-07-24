
export type ThemeSource = 'system' | 'dark' | 'light'

export default interface ThemeContract {
  themeSource: ThemeSource
  shouldUseDarkColors: boolean

  setThemeSource(themeSource: ThemeSource): Promise<ThemeSource>
}
