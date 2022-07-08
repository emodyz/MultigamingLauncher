import Arma3 from '../modules/arma3/main'
import MainGameModule from '../comunication/MainGameModule'

export default class ModuleController {
  private readonly modules = new Map<string, MainGameModule>([
    ['arma3', new MainGameModule(new Arma3())]
    // ['minecraft', new GameModule(new Arma3())]
  ])
}
