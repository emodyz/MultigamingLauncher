import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  new VuexPersistence({
    modules: [
      'favorites'
    ]
  }).plugin(store)
}
