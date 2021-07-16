import { execFile } from 'child_process'

export default abstract class GameLauncher {
  private readonly gamePath: string;
  private controller: null|AbortController = null;

  public constructor (gamePath: string) {
    this.gamePath = gamePath
  }

  protected abstract toCommand(): string[];

  run () {
    if (this.controller) {
      throw new Error('Cannot run two games.')
    }

    const command = this.toCommand()
    this.controller = new AbortController()

    console.log('run', this.gamePath, command)

    // @ts-ignore
    execFile(this.gamePath, command, { signal: this.controller.signal }, (error, response) => {
      console.log(error, response)
    })
  }

  abort () {
    if (!this.controller) {
      throw new Error('Cannot abort before run a games.')
    }

    this.controller.abort()
    this.controller = null
  }
}
