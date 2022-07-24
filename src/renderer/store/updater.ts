import { Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { serverStore } from '~/utils/store-accessor'

@Module({
  name: 'updater',
  stateFactory: false,
  namespaced: true,
  preserveState: true
})
export default class Updater extends VuexModule {
  servers: any[] = []

  get hasUpdate () {
    return (serverId: string, updateHash: string) => {
      const index = this.servers.map(server => server.id).indexOf(serverId)
      if (index !== -1) {
        return this.servers[index].hash !== updateHash
      }
      return true
    }
  }

  @Mutation
  add (serverId: string) {
    const index = this.servers.map(server => server.id).indexOf(serverId)
    const server = serverStore.server(serverId)

    if (!server) {
      return
    }

    if (index !== -1) {
      this.servers[index].hash = server.update_hash
    } else {
      this.servers.push({
        id: server.id,
        hash: server.update_hash
      })
    }
  }

  @Mutation
  remove (serverId: string) {
    const index = this.servers.map(server => server.id).indexOf(serverId)
    if (index !== -1) {
      this.servers.splice(index, 1)
    }
  }
}
