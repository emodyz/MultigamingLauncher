import RendererCommunicator from '../../shared/communicator/renderer/RendererCommunicator'
import { Communicator } from '../../shared/communicator/renderer/Communicator'
import { MainLogger } from '../../main/communicator/MainLogger'
import { LoggerEvents } from '../../shared/contracts/comunication/logger/LoggerContract'

@RendererCommunicator('logger', MainLogger)
export default class Logger extends Communicator<MainLogger, LoggerEvents> {
  init () {
    console.log('Ready to log backend console')

    this.on(LoggerEvents.LOG, (...args: any[]) => {
      console.log('[LOGGER] ', ...args)
    })

    this.on(LoggerEvents.ERROR, (...args: any[]) => {
      console.error('[LOGGER] ', ...args)
    })
  }
}
