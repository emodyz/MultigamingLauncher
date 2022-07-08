import { createDownloader, Downloader, DownloaderState } from '@emodyz/node-downloader'
import { findSteamAppById, findSteamAppByName, findSteamLibraries } from '@moddota/find-steam-app'

export class Sdk {
  public static createDownloader (): Downloader {
    return createDownloader()
  }

  public static async findSteamAppByAppId (appId: number): Promise<string | null> {
    try {
      return await findSteamAppById(appId) || null
    } catch (e) {
      return Promise.resolve(null)
    }
  }

  public static async findSteamAppByName (appName: string): Promise<string | null> {
    try {
      return await findSteamAppByName(appName) || null
    } catch (e) {
      return Promise.resolve(null)
    }
  }

  public static async findSteamLibraries (): Promise<string[]> {
    return await findSteamLibraries()
  }
}

export * from './contracts/Module'
export * from './contracts/GameModule'
export {
  GameModule
} from './game/GameModule'
export {
  Downloader,
  DownloaderState,
  createDownloader
}
