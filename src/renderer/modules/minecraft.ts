import * as path from 'path'
import * as fs from 'fs'
// @ts-ignore TODO: Fix that !
import { Downloader, GameModule, ModPack, Sdk } from '~/modules/lib/Sdk'

// @ts-ignore
export default class Minecraft extends GameModule {
  gameIdentifier = 'minecraft';
  version = '1.0.0';

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

  protected validateGamePath (gamePath: string): boolean {
    const allowedGamesFiles = [
      'minecraft.exe'
    ]
    const files = fs.readdirSync(gamePath).map(file => file.toLowerCase())

    for (const allowedFile of allowedGamesFiles) {
      if (files.includes(allowedFile)) {
        return true
      }
    }
    return false
  }
}
