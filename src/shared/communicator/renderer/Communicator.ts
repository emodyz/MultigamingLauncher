import { Context } from '../../helper/Context'
import { FunctionPropertyNames, SyncableAttributes } from '../helper'

export interface ICommunicator<Props, Events> {
   uniqIdentifier?: string|null

   destroy(): void
   on(event: Events, eventCallBack: (...args: any[]) => any)

   call<Function extends FunctionPropertyNames<Props>, FunctionType = Props[Function]>(
     func: Function,
     ...args: FunctionType extends ((...args: infer P) => any) ? P : never[]
     // @ts-ignore
   ): ReturnType<FunctionType>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class _Communicator<Props, Events> extends Context<ICommunicator<Props, Events>> {
}

export const Communicator: new<Props, Events = {}>(uniqIdentifier?: string) => &
  SyncableAttributes<Props> &
  _Communicator<Props, Events> &
  Props = _Communicator as any

// eslint-disable-next-line no-redeclare
export type Communicator<Props, Events = {}> = & SyncableAttributes<Props> & _Communicator<Props, Events> & Props
