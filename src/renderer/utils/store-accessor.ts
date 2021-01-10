import {Store} from 'vuex'
import {getModule} from 'vuex-module-decorators'
import Downloaders from '~/store/downloaders'
import Updater from '~/store/updater'
import Page from '~/store/page'

let downloadersStore: Downloaders
let updaterStore: Updater
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
