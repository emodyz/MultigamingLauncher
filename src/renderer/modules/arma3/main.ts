import * as path from 'path'
import * as fs from 'fs'
// @ts-ignore TODO: Fix that !
import { Downloader, GameExecutable, GameModule, ModPack, Sdk } from '~/modules/sdk/Sdk'
import Arma3Launcher from '~/modules/arma3/Arma3Launcher'
import Server from '~/models/server'

// @ts-ignore
export default class Main extends GameModule {
  gameIdentifier = 'arma3';
  version = '1.0.0';

  gamesApps: GameExecutable[] = [
    {
      platform: 'darwin',
      binary: 'arma3.app'
    },
    {
      platform: 'win32',
      binary: 'arma3battleye.exe'
    }
  ];

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

  play (modPacks: ModPack[], server: Server): Promise<boolean> {
    return new Promise(resolve => {
      const launcher = new Arma3Launcher(this.gamePathWithBinary)

      launcher.withModPacks(modPacks.map(modPack => modPack.name))

      launcher.setServerHost(`${server.ip}:${server.port}`)

      launcher.run()

      resolve(true)
    })
  }
}
