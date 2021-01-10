import {Store} from 'vuex'
import {getModule} from 'vuex-module-decorators'
import Downloaders from '~/store/downloaders'
import Updater from '~/store/updater'
import Page from '~/store/page'

// eslint-disable-next-line import/no-mutable-exports
let downloadersStore: Downloaders
// eslint-disable-next-line import/no-mutable-exports
let updaterStore: Updater
// eslint-disable-next-line import/no-mutable-exports
let pageStore: Page

function initialiseStores (store: Store<any>): void {
  downloadersStore = getModule(Downloaders, store)
  updaterStore = getModule(Updater, store)
  pageStore = getModule(Page, store)
}

export {
  initialiseStores,
  downloadersStore,
  updaterStore,
  pageStore
}
