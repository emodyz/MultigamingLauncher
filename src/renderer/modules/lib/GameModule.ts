// @ts-ignore TODO: Fix that !
import { Downloader } from '@emodyz/node-downloader'

export interface FileManifest {
  url: string;
  name: string;
  size: string;
  sha256: string;
}

export interface ModPack {
  name: string;
  manifest: FileManifest[];
}

export abstract class GameModule {
  public abstract gameIdentifier: string;
  public abstract version: string;

  private _gamePath!: string;

  public get gamePath () {
    return this._gamePath
  }

  public set gamePath (gamePath: string) {
    if (!this.validateGamePath(gamePath)) {
      throw new Error('Invalid game path.')
    }
    this._gamePath = gamePath
  }

  public abstract findGamePath(): Promise<string | null>;

  public abstract validateGamePath(gamePath: string): boolean;

  public abstract prepareDownload(modPacks: ModPack[]): Downloader;

  public abstract install(): void;

  public abstract play(): void;
}
