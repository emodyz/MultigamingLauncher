import ModPack from '../../../../sdk/definitions/ModPack'
import DownloaderContract from '../downloader/DownloaderContract'

export default interface GameModuleContract
{
  findGamePath(): Promise<string | null>

  isGameRunning(): Promise<boolean>

  checkGamePath(gamePath: string): Promise<boolean>;

  createDownloader(serverId: string, modPacks: ModPack[]): Promise<DownloaderContract>;
}
