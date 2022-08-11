import MainAppUpdater from './MainAppUpdater'
import MainDownloaderController from './MainDownloaderController'
import MainTheme from './MainTheme'
import { MainLogger } from './MainLogger'

function start (Instance: any) {
  // Handle singleton class
  if ('get' in Instance) {
    return Instance.get()
  }
  return new Instance()
}

start(MainLogger)
start(MainAppUpdater)
start(MainDownloaderController)
start(MainTheme)
