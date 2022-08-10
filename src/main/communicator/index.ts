import MainUpdater from './MainUpdater'
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

const logger = start(MainLogger) as MainLogger

console.log = (...args: any[]) => logger.log(...args)
console.error = (...args: any[]) => logger.error(...args)

start(MainUpdater)
start(MainDownloaderController)
start(MainTheme)
