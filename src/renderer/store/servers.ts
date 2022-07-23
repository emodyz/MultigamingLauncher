import { MutationAction, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { $axios } from '~/utils/api'
import Server from '~/models/server'

@Module({
  name: 'servers',
  stateFactory: false,
  namespaced: true,
  preserveState: true
})
export default class Servers extends VuexModule {
  servers: Server[] = []
  favoritesServerIds: any[] = []

  get isFavorite () {
    return (serverId: string) => {
      return this.favoritesServerIds.includes(serverId)
    }
  }

  get favorites () {
    return this.favoritesServerIds.map(serverId => {
      const index = this.servers.map(server => server.id).indexOf(serverId)
      if (index !== -1) {
        return this.servers[index]
      }
      return null
    }).filter(server => server !== null)
  }

  get server () {
    return (serverId: string): Server | null => {
      const index = this.servers.map(server => server.id).indexOf(serverId)
      if (index !== -1) {
        return this.servers[index]
      }
      return null
    }
  }

  @Mutation
  favServer (serverId: string) {
    if (!this.favoritesServerIds.includes(serverId)) {
      this.favoritesServerIds.push(serverId)
    }
  }

  @Mutation
  unfavServer (serverId: string) {
    const index = this.favoritesServerIds.indexOf(serverId)
    if (index !== -1) {
      this.favoritesServerIds.splice(index, 1)
    }
  }

  @MutationAction
  async sync () {
    const servers = (await $axios.$get('/servers')).data
    const favoritesServerIds: any[] = this.favoritesServerIds

    for (const serverId of favoritesServerIds) {
      if (!servers.map((server: any) => server.id).includes(serverId)) {
        const index = favoritesServerIds.indexOf(serverId)
        if (index !== -1) {
          favoritesServerIds.splice(index, 1)
        }
      }
    }

    return {
      servers,
      favoritesServerIds
    }
  }
}
