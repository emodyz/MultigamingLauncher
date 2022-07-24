import { CacheContract } from '../../../shared/contracts/cache/CacheContract'
const Store = require('electron-store')

export default class ElectronCacheDriver implements CacheContract {
  private store = new Store()

  get<T> (key: string): T {
    return this.store.get(key) as T
  }

  set<T> (key: string, value: T): void {
    this.store.set(key, value)
  }

  has (key: string): boolean {
    return this.store.has(key)
  }

  delete (key: string): void {
    this.store.delete(key)
  }
}
