import * as VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  new VuexPersistence({
    modules: [
      'servers',
      'updater',
      'theme',
      'games'
    ]
  }).plugin(store)
}
