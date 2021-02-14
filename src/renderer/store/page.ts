import { Module, Mutation, VuexModule } from 'vuex-module-decorators'

@Module({
  name: 'page',
  stateFactory: true,
  namespaced: true
})
export default class Theme extends VuexModule {
  title: string | null = null;

  @Mutation
  setTitle (title: string | null) {
    this.title = title
  }

  @Mutation
  noTitle () {
    this.title = null
  }
}
