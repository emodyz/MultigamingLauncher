// import * as path from 'path'
// import * as fs from 'fs'
// @ts-ignore TODO: Fix that !
import Server from '../../../renderer/models/server'
import { /* Downloader, */BaseGameModule, Sdk } from '../../../sdk/Sdk'
// import FileManifest from '../../../sdk/definitions/FileManifest'
import GameExecutable from '../../../sdk/definitions/GameExecutable'
import ModPack from '../../../sdk/definitions/ModPack'
import Arma3Launcher from './Arma3Launcher'

// @ts-ignore
export default class Main extends BaseGameModule {
  gameIdentifier = 'arma3';
  version = '1.0.0';

  gameApps: GameExecutable[] = [
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

  /* prepareDownload (modPacks: ModPack[]): Downloader {
    const downloader = Sdk.createDownloader()

    modPacks.forEach(modPack => {
      const manifest = Object.values(modPack.manifest)

      manifest.forEach((file: FileManifest) => {
        const filePath = path.resolve(this.gamePath, path.dirname(file.path))
        fs.mkdirSync(filePath, {
          recursive: true
        }) // TODO: Do Downloader library able to do that @iWirk ?

        console.log(filePath)

        downloader.addFile(file.url, filePath, null, file.sha256)
      })
    })

    return downloader
  } */

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
