import ModPack from '../../../../sdk/definitions/ModPack'
import Server from '../../../../renderer/models/server'

export default interface GameModuleContract
{
  findGamePath(): Promise<string | null>

  isGameRunning(): Promise<boolean>

  checkGamePath(gamePath: string): Promise<boolean>

  createDownloader(serverId: string, modPacks: ModPack[]): Promise<void>

  play(modPacks: ModPack[], server: Server): Promise<boolean>

  killGame(): Promise<boolean>
}
