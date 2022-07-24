import { Module, Mutation, VuexModule } from 'vuex-module-decorators'

interface Game {
  id: string;
  path: string;
  serverId: string;
}

@Module({
  name: 'games',
  stateFactory: false,
  namespaced: true
})
export default class Games extends VuexModule {
  games: Game[] = []

  get gamePathByServerAndGameId (): (serverId: string) => (string|null) {
    return (serverId: string) => {
      const index = this.games
        .map(game => game.serverId)
        .indexOf(serverId)

      if (index === -1) {
        return null
      }

      return this.games[index].path
    }
  }

  @Mutation
  add ({ gameId, serverId, gamePath }: {gameId: string, serverId: string, gamePath: string}) {
    const index = this.games.map(game => game.serverId).indexOf(serverId)

    if (index === -1) {
      this.games.push({
        id: gameId,
        path: gamePath,
        serverId
      })
    } else {
      this.games[index].path = gamePath
    }
  }
}
