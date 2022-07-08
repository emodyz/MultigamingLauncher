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
      private readonly channel: string|null

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

        console.log('init main', this.channel)

        return handleMain(this.channel, this)
      }

      trigger (event: any, ...args: any[]): void {
        send(`${this.channel}-event`, event, ...args)
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
        console.log('getter accessed for', key)
        return currentInstance[`_${key}`]
      },
      set (value: any) {
        console.log('setter accessed for', key)

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
