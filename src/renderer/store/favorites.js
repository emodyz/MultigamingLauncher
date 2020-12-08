export const state = () => ({
  list: []
})

export const getters = {
  favorites: state => state.list,
  isFavorite: state => server => {
    return state.list.map(server => server.id).includes(server.id);
  }
}

export const mutations = {
  favServer (state, server) {
    state.list.push(server)
  },

  unfavServer (state, server) {
    const index = state.list.map(server => server.id).indexOf(server.id);
    if (index !== -1) {
      state.list.splice(index, 1)
    }
  }
}
