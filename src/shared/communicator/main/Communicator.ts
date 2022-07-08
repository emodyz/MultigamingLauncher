import { Context } from '../../helper/Context'

export interface ICommunicator<Events> {
  uniqIdentifier?: string|null

  trigger(event: Events, ...args: any[]): void
}

export class Communicator<Events = {}> extends Context<ICommunicator<Events>> {
}
