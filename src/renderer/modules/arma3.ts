import {Downloader, GameModule, Modpack, Sdk} from "~/modules/lib/Sdk";

import * as path from 'path';
import * as fs from 'fs';

// @ts-ignore
export default class Arma3 extends GameModule {
  gameIdentifier = 'arma3';
  version = '1.0.0';

  async findGamePath(): Promise<string | null> {
    return '/Users/hubert_i/Downloads/test';
    return await Sdk.findSteamAppByName(this.gameIdentifier);
  }

  prepareDownload(modpacks: Modpack[]): Downloader {
    const downloader = Sdk.createDownloader();

    modpacks.forEach(modpack => {
      const manifest = Object.values(modpack.manifest)

      manifest.forEach(file => {
        downloader.addFile(file.url, this.gamePath, null, file.sha256)
      })
    })

    return downloader;
  }

  install(): void {
    console.log('install games modules');
  }

  protected validateGamePath(gamePath: string): boolean
  {
    if (!fs.existsSync(path.resolve(gamePath, 'arma3.exe'))) {
      return false;
    }

    return true;
  }

}
