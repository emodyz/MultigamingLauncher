// import { Downloader } from '@emodyz/node-downloader'
import Server from '../../renderer/models/server'
import GameExecutable from '../definitions/GameExecutable'
import ModPack from '../definitions/ModPack'
import Module from './Module'

export default interface GameModule extends Module {
  gameApps: GameExecutable[]

  /**
   * Game Path Section
   */
  validateGamePath(gamePath: string): boolean;

  findGamePath(): Promise<string | null>;

  /**
   * Game Launch Section
   */
  isGameRunning(): Promise<boolean>;

  killGame(): Promise<boolean>;

  play(modPacks: ModPack[], server: Server): Promise<boolean>;

  /**
   * Download section
   */
  // prepareDownload(modPacks: ModPack[]): Downloader; TODO: @node-downloader is broken

  /**
   * @deprecated
   */
  install(): void
}
