import * as path from 'path'
import * as fs from 'fs'
// @ts-ignore TODO: Fix that !
import { Downloader, GameExecutable, GameModule, ModPack, Sdk } from '../../sdk/Sdk'

// @ts-ignore
export default class Main extends GameModule {
  gameIdentifier = 'minecraft';
  version = '1.0.0';

  gamesApps: GameExecutable[] = [
    {
      platform: 'win32',
      binary: 'minecraft.exe'
    },
    {
      platform: 'win32',
      binary: 'minecraft.jar'
    },
    {
      platform: 'darwin',
      binary: 'minecraft.app'
    },
    {
      platform: 'darwin',
      binary: 'minecraft.jar'
    }
  ]

  async findGamePath (): Promise<string | null> {
    return await Sdk.findSteamAppByName('minecraft')
  }

  prepareDownload (modPacks: ModPack[]): Downloader {
    const downloader = Sdk.createDownloader()

    modPacks.forEach(modPack => {
      const manifest = Object.values(modPack.manifest)
      const modPackInstallPath = path.resolve(this.gamePath, modPack.name)

      fs.mkdirSync(modPackInstallPath, {
        recursive: true
      }) // TODO: Do Downloader library able to do that @iWirk ?

      manifest.forEach(file => {
        downloader.addFile(file.url, modPackInstallPath, null, file.sha256)
      })
    })

    return downloader
  }

  install (): void {
    console.log('install games modules')
  }
}
