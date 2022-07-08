import { ipcRenderer } from 'electron'
import { BehaviorSubject } from 'rxjs'
import { Constructor } from '../helper'
import { ICommunicator } from './Communicator'

export default function RendererCommunicator (id: string, mainObject: any) {
  const isRenderer = process && process.type === 'renderer'
  const mainChannel = `communicator.${id}`

  return function <T extends Constructor> (Target: T) {
    return class RendererCommunicatorClass extends Target implements ICommunicator<any, any> {
      public uniqIdentifier?: string|null
      private readonly channel: string
      private readonly propsToListen: BehaviorSubject<any>[] = []

      private handler: ProxyHandler<RendererCommunicatorClass> = {
        get: (target: any, prop: string, receiver: any) => {
          if (prop in target) {
            console.log('forward local call\t', prop)
            return Reflect.get(target, prop, receiver)
          }

          let safeProp = prop.toString()
          const isSyncWanted = safeProp.endsWith('Sync')

          if (typeof mainObject.prototype[safeProp] === 'function') {
            return (...args: any[]) => {
              console.log('forward function call\t', prop, args)
              return this.call(safeProp, ...args)
            }
          }

          console.log('forward attribute getter\t', prop)

          if (isSyncWanted) {
            safeProp = safeProp.substring(0, safeProp.length - 4)
          }

          const res = ipcRenderer.sendSync(this.channel, safeProp)

          if (isSyncWanted) {
            if (!this.propsToListen[`${this.channel}-${safeProp}`]) {
              this.propsToListen[`${this.channel}-${safeProp}`] = new BehaviorSubject(res)
            }

            return this.propsToListen[`${this.channel}-${safeProp}`]
          }

          return res
        }
      }

      constructor (...args: any[]) {
        super(...args)

        if (this.uniqIdentifier) {
          this.channel = `${mainChannel}.${this.uniqIdentifier}`
        } else {
          this.channel = mainChannel
        }

        if (!isRenderer) {
          throw new Error('Cannot use this decorator on main process')
        }
        console.log('init renderer', this.channel)

        ipcRenderer.on(`${this.channel}-set`, (_, prop, value) => {
          const safeProps = prop.toString()
          console.log('prop value changed', prop, value)
          if (this.propsToListen[`${this.channel}-${safeProps}`]) {
            this.propsToListen[`${this.channel}-${safeProps}`].next(value)
          }
        })

        return new Proxy(this, this.handler)
      }

      on (event: any, eventCallBack: (...args: any[]) => any) {
        ipcRenderer.on(`${this.channel}-event`, (_, triggerEvent: string, ...args: any[]) => {
          if (event === triggerEvent) {
            eventCallBack(...args)
          }
        })
      }

      call (funcName: string, ...args) {
        return ipcRenderer.invoke(`${this.channel}-call`, funcName, ...args)
      }

      destroy () {
        console.log('destroy')

        this.propsToListen.forEach(prop => prop.unsubscribe())

        ipcRenderer.removeAllListeners(`${this.channel}`)
        ipcRenderer.removeAllListeners(`${this.channel}-call`)
        ipcRenderer.removeAllListeners(`${this.channel}-set`)
        ipcRenderer.removeAllListeners(`${this.channel}-event`)
      }
    }
  }
}
