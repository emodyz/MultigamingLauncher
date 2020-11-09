export const state = () => ({
  list: new Map(),
  progresses: new Map()
})

export const getters = {
  downloaders: state => state.list,
  downloaderByServer: state => server => state.list.get(server),
  progressByServer: state => server => state.progress.get(server) || 0
}

export const mutations = {
  add (state, { server, downloader }) {
    state.list.set(server, downloader)
    state.list = new Map(state.list)

    state.progresses.set(server, 0)
    state.progresses = new Map(state.progresses)
  },

  remove (state, server) {
    state.list.delete(server)
    state.list = new Map(state.list)

    state.progresses.delete(server)
    state.progresses = new Map(state.progresses)
  },

  start (state, {server, forceDownload = false}) {
    const downloader = state.list.get(server)
    if (downloader) {
      downloader.on('progress', stats => {
        state.progresses.set(server, stats.progressTotal)
        state.progresses = new Map(state.progresses)
      })
      downloader.on('end', () => {
        state.list.delete(server)
        state.list = new Map(state.list)

        state.progresses.delete(server)
        state.progresses = new Map(state.progresses)
      })
      downloader.start(forceDownload)
    }
  },

  stop (state, server) {
    const downloader = state.list.get(server)
    if (downloader) {
      downloader.stop()

      state.list.delete(server)
      state.list = new Map(state.list)

      state.progresses.delete(server)
      state.progresses = new Map(state.progresses)
    }
  },

  pause (state, server) {
    const downloader = state.list.get(server)
    if (downloader) {
      downloader.pause()
    }
  },

  resume (state, server) {
    const downloader = state.list.get(server)
    if (downloader) {
      downloader.resume()
    }
  }

}
