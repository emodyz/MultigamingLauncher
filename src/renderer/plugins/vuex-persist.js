import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  new VuexPersistence({
    modules: [
      'servers',
      'updater'
    ]
  }).plugin(store)
}
