import FileManifest from './FileManifest'

export default interface ModPack {
  name: string;
  manifest: FileManifest[];
}
