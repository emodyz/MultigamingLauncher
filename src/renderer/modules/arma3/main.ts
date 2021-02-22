import * as path from 'path'
import * as fs from 'fs'
// @ts-ignore TODO: Fix that !
import { Downloader, GameModule, ModPack, Sdk } from '~/modules/sdk/Sdk'
import Arma3Launcher from '~/modules/arma3/Arma3Launcher'

// @ts-ignore
export default class Main extends GameModule {
  gameIdentifier = 'arma3';
  version = '1.0.0';

  async findGamePath (): Promise<string | null> {
    return await Sdk.findSteamAppByAppId(107410)
  }

  prepareDownload (modPacks: ModPack[]): Downloader {
    const downloader = Sdk.createDownloader()

    modPacks.forEach(modPack => {
      const manifest = Object.values(modPack.manifest)

      manifest.forEach(file => {
        const filePath = path.resolve(this.gamePath, path.dirname(file.path))
        fs.mkdirSync(filePath, {
          recursive: true
        }) // TODO: Do Downloader library able to do that @iWirk ?

        console.log(filePath)

        downloader.addFile(file.url, filePath, null, file.sha256)
      })
    })

    return downloader
  }

  install (): void {
    console.log('install games modules')
  }

  protected validateGamePath (gamePath: string): boolean {
    const allowedGamesFiles = [
      'arma3.exe',
      'arma3battleye.exe',
      'arma3.app'
    ]
    const files = fs.readdirSync(gamePath).map(file => file.toLowerCase())

    for (const allowedFile of allowedGamesFiles) {
      if (files.includes(allowedFile)) {
        return true
      }
    }
    return false
  }

  play (modPacks: ModPack[]): Promise<boolean> {
    return new Promise(resolve => {
      const launcher = new Arma3Launcher(path.resolve(this.gamePath, 'arma3battleye.exe'))

      launcher.withModPacks(modPacks.map(modPack => modPack.name))

      launcher.run()

      resolve(true)
    })
  }
}
