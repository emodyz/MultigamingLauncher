import ModPack from '../../../sdk/definitions/ModPack'
import DownloaderProtocol from '../downloader/DownloaderProtocol'

export enum Channels {
  EXIST = 'module.exist',
  FIND_GAME_PATH= 'module.findGamePath',
  IS_GAME_RUNNING = 'module.isGameRunning',
  VALIDE_GAME_PATH = 'module.validateGamePath',
  CREATE_DOWNLOADER = 'module.createDownloader',
  GET_DOWNLOADER = 'module.getDownloader'
}

export default interface GameModuleProtocol
{
  findGamePath(): Promise<string | null>

  isGameRunning(): Promise<boolean>

  validateGamePath(gamePath: string): Promise<boolean>;

  createDownloader(serverId: string, modPacks: ModPack[]): Promise<DownloaderProtocol>;
}
