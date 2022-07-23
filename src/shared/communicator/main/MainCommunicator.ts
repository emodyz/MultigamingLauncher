import { ipcMain } from 'electron'
import { send } from '../../../main/helpers/events'
import { Constructor } from '../helper'
import { ICommunicator } from './Communicator'

export default function MainCommunicator (id: string) {
  const mainChannel = `communicator.${id}`
  const isRenderer = process && process.type === 'renderer'

  return function <T extends Constructor> (Target: T) {
    return class MainCommunicatorClass extends Target implements ICommunicator<any> {
      public uniqIdentifier?: string|null
      private readonly channel: string

      constructor (...args: any[]) {
        super(...args)

        if (this.uniqIdentifier) {
          this.channel = `${mainChannel}.${this.uniqIdentifier}`
        } else {
          this.channel = mainChannel
        }

        if (isRenderer) {
          throw new Error('Cannot use this decorator on renderer process')
        }

        return handleMain(this.channel, this)
      }

      trigger (event: any, ...args: any[]): void {
        console.log(`Event triggered - ${event}`, args)
        send(`${this.channel}-event`, event, ...args)
      }

      destroy (): void {
        console.log('destroy', this.channel)

        ipcMain.removeAllListeners(this.channel)
        ipcMain.removeHandler(`${this.channel}-call`)
      }
    }
  }
}

function handleMain (channel: string, currentInstance: any) {
  console.log('channel: ', channel)

  Object.keys(currentInstance).forEach(key => {
    currentInstance[`_${key}`] = currentInstance[key]

    Object.defineProperty(currentInstance, key, {
      get (): any {
        return currentInstance[`_${key}`]
      },
      set (value: any) {
        send(`${channel}-set`, key, value)

        currentInstance[`_${key}`] = value
        return true
      }
    })
  })

  ipcMain.on(channel, (event, prop: string) => {
    console.log(channel, prop)
    event.returnValue = currentInstance[prop]
  })

  ipcMain.handle(`${channel}-call`, async (_, prop: string, ...args: any[]) => {
    console.log(`${channel}-call`, prop, args)
    return await currentInstance[prop](...args)
  })

  return currentInstance
}
