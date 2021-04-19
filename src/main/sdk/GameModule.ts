import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import * as process from 'process'
// @ts-ignore TODO: Fix that !
import { Downloader } from '@emodyz/node-downloader'
// @ts-ignore
import * as find from 'find-process'
import Server from '../../renderer/models/server'

export interface FileManifest {
  url: string;
  path: string;
  name: string;
  size: string;
  sha256: string;
}

export interface ModPack {
  name: string;
  manifest: FileManifest[];
}

export interface GameExecutable {
  // eslint-disable-next-line no-undef
  platform: NodeJS.Platform;
  binary: string;
}

export abstract class GameModule {
  public abstract gameIdentifier: string;
  public abstract version: string;

  public abstract gamesApps: GameExecutable[];

  protected gamePath!: string;
  protected gameBinary!: string;

  get gamePathWithBinary (): string {
    return path.resolve(this.gamePath, this.gameBinary)
  }

  public validateGamePath (gamePath: string): boolean {
    const allowedGamesExecutable = this.gamesApps.filter(gameApp => gameApp.platform === os.platform())

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

  public async isRunning (): Promise<boolean> {
    try {
      const list = await find('name', 'arma3')
      console.log(list)
      return list.length > 0
    } catch (e) {
    }
    return false
  }

  public async kill () {
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

  public abstract prepareDownload(modPacks: ModPack[]): Downloader;

  public abstract install(): void;

  public abstract play(modPacks: ModPack[], server: Server): Promise<boolean>;
}
