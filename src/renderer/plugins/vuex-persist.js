// eslint-disable-next-line import/no-named-as-default
import VuexPersistence from 'vuex-persist'

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
