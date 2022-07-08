import ModPack from '../../../sdk/definitions/ModPack'
import DownloaderContract from '../downloader/DownloaderContract'

export enum Channels {
  EXIST = 'module.exist',
  FIND_GAME_PATH= 'module.findGamePath',
  IS_GAME_RUNNING = 'module.isGameRunning',
  CHECK_GAME_PATH = 'module.checkGamePath',
  CREATE_DOWNLOADER = 'module.createDownloader'
}

export default interface GameModuleContract
{
  findGamePath(): Promise<string | null>

  isGameRunning(): Promise<boolean>

  checkGamePath(gamePath: string): Promise<boolean>;

  createDownloader(serverId: string, modPacks: ModPack[]): Promise<DownloaderContract>;
}
