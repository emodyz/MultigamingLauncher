import MainUpdater from './MainUpdater'
import MainDownloaderController from './MainDownloaderController'
import MainTheme from './MainTheme'

function start (Instance: any) {
  // Handle singleton class
  if ('get' in Instance) {
    return Instance.get()
  }
  return new Instance()
}

start(MainUpdater)
start(MainDownloaderController)
start(MainTheme)
