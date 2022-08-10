import MainCommunicator from '../../shared/communicator/main/MainCommunicator'
import { Communicator } from '../../shared/communicator/main/Communicator'
import { LoggerEvents } from '../../shared/contracts/comunication/logger/LoggerContract'

const originalLoggerLog = console.log
const originalLoggerError = console.error

@MainCommunicator('logger')
export class MainLogger extends Communicator<LoggerEvents> {
  log (message?: any, ...optionalParams: any[]) {
    this.trigger(LoggerEvents.LOG, message, ...optionalParams)
    originalLoggerLog(`[LOGGER] - ${message}`, ...optionalParams)
  }

  error (message?: any, ...optionalParams: any[]) {
    this.trigger(LoggerEvents.ERROR, message, ...optionalParams)
    originalLoggerError(`[LOGGER] - ${message}`, ...optionalParams)
  }
}
