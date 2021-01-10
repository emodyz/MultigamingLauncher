import {Module, Mutation, VuexModule} from 'vuex-module-decorators'

@Module({
  name: 'page',
  stateFactory: true,
  namespaced: true
})
export default class Page extends VuexModule {

  title: string | null = null;

  @Mutation
  setTitle(title: string) {
    this.title = title;
  }
}
