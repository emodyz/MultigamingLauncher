export const state = () => ({
  servers: []
})

export const getters = {
  hasUpdate: state => (serverId, updateHash) => {
    const index = state.servers.map(server => server.id).indexOf(serverId)
    if (index !== -1) {
      return state.servers[index].hash !== updateHash
    }
    return true
  }
}

export const mutations = {
  add (state, server) {
    const index = state.servers.map(server => server.id).indexOf(server.id)
    if (index !== -1) {
      state.servers[index].hash = server.update_hash
    } else {
      state.servers.push({
        id: server.id,
        hash: server.update_hash
      })
    }
  }
}
