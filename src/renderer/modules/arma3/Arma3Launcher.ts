import GameLauncher from '~/modules/sdk/GameLauncher'

export default class Arma3Launcher extends GameLauncher {
  private command: string[] = ['2', '1', '-nopause'];
  private modPacksNames: string[] = []

  /**
   * Server Part
   */
  private serverHost: string|null = null;
  private serverPassword: string|null = null

  public withModPacks (names: string|string[]): Arma3Launcher {
    if (Array.isArray(names)) {
      this.modPacksNames.push(...names)
    } else {
      this.modPacksNames.push(names)
    }

    return this
  }

  public setServerHost (host: string) {
    this.serverHost = host
  }

  public setServerPassword (password: string) {
    this.serverPassword = password
  }

  protected toCommand (): string[] {
    const commands = this.command

    commands.push(`-mod=${this.modPacksNames.join(';')}`)

    if (this.serverHost) {
      commands.push(`-connect=${this.serverHost}`)
    }

    if (this.serverPassword) {
      commands.push(`-password=${this.serverPassword}`)
    }

    return commands
  }
}
