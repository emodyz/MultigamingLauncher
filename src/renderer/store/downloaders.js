export const state = () => ({
  list: []
})

export const getters = {
  downloaders: state => state.list,
  downloaderByServer: state => serverId => {
    const index = state.list.map(downloader => downloader.server.id).indexOf(serverId)
    return state.list[index]?.downloader
  },
  progressByServer: state => serverId => downloaderProgress(state, serverId)
}

export const mutations = {
  add (state, { server, downloader }) {
    state.list.push({
      server,
      downloader,
      progress: 0
    })
  },

  remove (state, serverId) {
    deleteDownloader(state, serverId)
  },

  start (state, { serverId, forceDownload = false }) {
    const downloader = findDownloader(state, serverId)
    if (downloader) {
      downloader.on('progress', stats => {
        setDownloaderProgress(state, serverId, stats.progressTotal)
        console.log(stats.progressTotal)
      })
      downloader.on('end', () => {
        deleteDownloader(state, serverId)
      })
      downloader.start(forceDownload)
    }
  },

  stop (state, serverId) {
    const downloader = findDownloader(state, serverId)
    if (downloader) {
      downloader.stop()
      deleteDownloader(state, serverId)
    }
  },

  pause (state, serverId) {
    const downloader = findDownloader(state, serverId)
    if (downloader) {
      downloader.pause()
    }
  },

  resume (state, serverId) {
    const downloader = findDownloader(state, serverId)
    if (downloader) {
      downloader.resume()
    }
  }
}

function deleteDownloader (state, serverId) {
  const index = state.list.map(downloader => downloader.server.id).indexOf(serverId)
  if (index !== -1) {
    state.list.splice(index, 1)
  }
}

function setDownloaderProgress (state, serverId, progress) {
  const index = state.list.map(downloader => downloader.server.id).indexOf(serverId)
  if (index !== -1) {
    state.list[index].progress = progress
  }
}

function downloaderProgress (state, serverId) {
  const index = state.list.map(downloader => downloader.server.id).indexOf(serverId)
  if (index !== -1) {
    return state.list[index].progress
  }
  return 0
}

function findDownloader (state, serverId) {
  const index = state.list.map(downloader => downloader.server.id).indexOf(serverId)
  if (index !== -1) {
    return state.list[index].downloader
  }
  return null
}

function findServer (state, serverId) {
  const index = state.list.map(downloader => downloader.server.id).indexOf(serverId)
  if (index !== -1) {
    return state.list[index].server
  }
  return null
}
