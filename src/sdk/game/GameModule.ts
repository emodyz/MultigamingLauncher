import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import * as process from 'process'
// @ts-ignore
import * as find from 'find-process'
import Server from '../../renderer/models/server'
import IGameModule from '../contracts/GameModule'
import GameExecutable from '../definitions/GameExecutable'
import ModPack from '../definitions/ModPack'
import { Downloader } from '../../Sdk/Sdk'

export abstract class GameModule implements IGameModule {
  public abstract readonly identifier: string;
  public abstract gameIdentifier: string;
  public abstract version: string;

  public abstract gameApps: GameExecutable[];

  protected gamePath!: string;
  protected gameBinary!: string;

  get gamePathWithBinary (): string {
    return path.resolve(this.gamePath, this.gameBinary)
  }

  public validateGamePath (gamePath: string): boolean {
    const allowedGamesExecutable = this.gameApps.filter(gameApp => gameApp.platform === os.platform())

    const files = fs.readdirSync(gamePath).map((file: string) => file.toLowerCase())

    for (const allowedFile of allowedGamesExecutable) {
      if (files.includes(allowedFile.binary)) {
        this.gamePath = gamePath
        this.gameBinary = allowedFile.binary
        return true
      }
    }
    return false
  }

  async isGameRunning (): Promise<boolean> {
    try {
      const list = await find('name', 'arma3')
      console.log(list)
      return list.length > 0
    } catch (e) {
    }
    return false
  }

  async killGame (): Promise<boolean> {
    try {
      const list = await find('name', 'arma3')
      list.forEach((program: any) => {
        process.kill(program.pid)
      })
      return list.length > 0
    } catch (e) {
    }
    return false
  }

  public abstract findGamePath(): Promise<string | null>;

  public abstract createDownloader(modPacks: ModPack[]): Downloader;

  public abstract install(): void;

  public abstract play(modPacks: ModPack[], server: Server): Promise<boolean>;
}
