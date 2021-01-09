export const state = () => ({
  favorites: [],
  servers: []
})

export const getters = {
  isFavorite: state => serverId => {
    return state.favorites.includes(serverId)
  },
  favorites: state => {
    state.favorites = state.favorites.filter(serverId => state.servers.map(server => server.id).includes(serverId))
    return state.favorites.map(serverId => {
      const index = state.servers.map(server => server.id).indexOf(serverId)
      if (index !== -1) {
        return state.servers[index]
      }
      return null
    })
  },
  servers: state => state.servers,
  server: state => serverId => {
    const index = state.servers.map(server => server.id).indexOf(serverId)
    if (index !== -1) {
      return state.servers[index]
    }
    return null
  }
}

export const mutations = {
  syncServers (state, servers) {
    state.servers = servers
  },

  favServer (state, serverId) {
    if (!state.favorites.includes(serverId)) {
      state.favorites.push(serverId)
    }
  },

  unfavServer (state, serverId) {
    const index = state.favorites.indexOf(serverId)
    if (index !== -1) {
      state.favorites.splice(index, 1)
    }
  }
}

export const actions = {
  async sync ({ state, commit }) {
    const servers = (await this.$axios.$get('/servers')).data
    commit('syncServers', servers)
    for (const favorite of state.favorites) {
      if (!servers.map(server => server.id).includes(favorite)) {
        commit('unfavServer', favorite)
      }
    }
  }
}
