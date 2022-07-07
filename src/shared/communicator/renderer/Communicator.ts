import { Context } from '../../helper/Context'
import { SyncableAttributes } from '../helper'

export interface ICommunicator<Events> {
   destroy(): void
   on(event: Events, eventCallBack: (...args: any[]) => any)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class _Communicator<Props, Events> extends Context<ICommunicator<Events>> {
}

export const Communicator: new<Props, Events = {}>() => &
  SyncableAttributes<Props> &
  _Communicator<Props, Events> &
  Props = _Communicator as any

// eslint-disable-next-line no-redeclare
export type Communicator<Props, Events = {}> = & SyncableAttributes<Props> & _Communicator<Props, Events> & Props
