export default interface GameModuleProtocol
{

  findGamePath(): Promise<string | null>

  isGameRunning(): Promise<boolean>

  validateGamePath(gamePath: string): Promise<boolean>;

}
