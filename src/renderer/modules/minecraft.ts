import * as path from 'path'
import * as fs from 'fs'
// @ts-ignore TODO: Fix that !
import { Downloader, GameModule, Modpack, Sdk } from '~/modules/lib/Sdk'

// @ts-ignore
export default class Minecraft extends GameModule {
  gameIdentifier = 'minecraft';
  version = '1.0.0';

  async findGamePath (): Promise<string | null> {
    return await Sdk.findSteamAppByAppId(107410)
  }

  prepareDownload (modpacks: Modpack[]): Downloader {
    const downloader = Sdk.createDownloader()

    modpacks.forEach(modpack => {
      const manifest = Object.values(modpack.manifest)
      const modpackInstallPath = path.resolve(this.gamePath, modpack.name)

      fs.mkdirSync(modpackInstallPath, {
        recursive: true
      }) // TODO: Do Downloader library able to do that @iWirk ?

      manifest.forEach(file => {
        downloader.addFile(file.url, modpackInstallPath, null, file.sha256)
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
