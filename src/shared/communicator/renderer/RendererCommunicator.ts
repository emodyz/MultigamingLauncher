import { ipcRenderer } from 'electron'
import { BehaviorSubject } from 'rxjs'
import { Constructor } from '../helper'
import { ICommunicator } from './Communicator'

export default function RendererCommunicator (id: string, mainObject: any) {
  const channel = `communicator.${id}`
  const isRenderer = process && process.type === 'renderer'

  return function <T extends Constructor> (Target: T) {
    return class RendererCommunicatorClass extends Target implements ICommunicator<any> {
      private readonly propsToListen: BehaviorSubject<any>[] = []

      private handler: ProxyHandler<RendererCommunicatorClass> = {
        get: (target: any, prop: string, receiver: any) => {
          if (prop in target) {
            return Reflect.get(target, prop, receiver)
          }

          let safeProp = prop.toString()
          const isSyncWanted = safeProp.endsWith('Sync')

          if (typeof mainObject.prototype[safeProp] === 'function') {
            return (...args: any[]) => {
              return ipcRenderer.invoke(`${channel}-call`, safeProp, ...args)
            }
          }

          if (isSyncWanted) {
            safeProp = safeProp.substring(0, safeProp.length - 4)
          }

          const res = ipcRenderer.sendSync(channel, safeProp)

          if (isSyncWanted) {
            if (!this.propsToListen[`${channel}-${safeProp}`]) {
              this.propsToListen[`${channel}-${safeProp}`] = new BehaviorSubject(res)
            }

            return this.propsToListen[`${channel}-${safeProp}`]
          }

          return res
        }
      }

      constructor (...args: any[]) {
        super(...args)
        if (!isRenderer) {
          throw new Error('Cannot use this decorator on main process')
        }
        console.log('init renderer')

        ipcRenderer.on(`${channel}-set`, (_, prop, value) => {
          const safeProps = prop.toString()
          console.log('prop value changed', prop, value)
          if (this.propsToListen[`${channel}-${safeProps}`]) {
            this.propsToListen[`${channel}-${safeProps}`].next(value)
          }
        })

        return new Proxy(this, this.handler)
      }

      on (event: any, eventCallBack: (...args: any[]) => any) {
        ipcRenderer.on(`${channel}-event`, (_, triggerEvent: string, ...args: any[]) => {
          if (event === triggerEvent) {
            eventCallBack(...args)
          }
        })
      }

      destroy () {
        console.log('destroy')

        this.propsToListen.forEach(prop => prop.unsubscribe())

        ipcRenderer.removeAllListeners(`${channel}`)
        ipcRenderer.removeAllListeners(`${channel}-call`)
        ipcRenderer.removeAllListeners(`${channel}-set`)
        ipcRenderer.removeAllListeners(`${channel}-event`)
      }
    }
  }
}
