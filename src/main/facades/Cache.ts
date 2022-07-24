import ElectronCacheDriver from '../drivers/cache/ElectronCacheDriver'
import Facade from '../../shared/decorators/Facade'
import { Context } from '../../shared/helper/Context'
import { CacheContract } from '../../shared/contracts/cache/CacheContract'

@Facade(ElectronCacheDriver)
class Cache extends Context<CacheContract> {

}

export default new Cache()
