<template>
  <div>
    <div v-if="server" class="flex justify-center items-center content-center flex-col">
      <h1>{{ server.name }}</h1>

      <div v-if="server.status" class="max-w-sm rounded overflow-hidden shadow-lg w-1/3 p-3">
        <div class="flex flex-col">
          <span class="font-bold underline">Players:</span>
          <span class="text-sm">Max: <span class="font-bold">{{ server.status.players_online }}</span></span>
          <span class="text-sm">Online: <span class="font-bold">{{ server.status.players_max }}</span></span>
        </div>
        <div class="flex flex-col pt-6">
          <span class="font-bold underline">Status:</span>
          <span v-if="server.status.online"
                class="text-center flex rounded bg-green-500 uppercase px-2 py-1 text-xs text-white font-bold mr-3"
          >Online</span>
          <span v-if="!server.status.online"
                class="text-center flex rounded bg-red-500 uppercase px-2 py-1 text-xs text-white font-bold mr-3"
          >Offline</span>
        </div>
      </div>
    </div>

    <div class="flex items-center flex-col justify-center shadow-lg absolute bottom-0 left-0 right-0"
         style="z-index: 1">
      <div v-if="downloading" class="w-full p-3">
        <div class="flex flex-col items-center justify-center content-center">
          <span>{{ speed }}</span>
          <span v-if="downloader">{{ downloader.stats().fileDownloaded }} / {{ downloader.stats().files }}</span>
        </div>
        <ProgressBar :progress="progress" class="mb-3" />
        <ProgressBar :progress="progressDownload" class="mb-3" />
        <ProgressBar :progress="progressCheck" class="mb-3" />
      </div>
      {{ installPath }}
      <div class="flex flex-row">
        <button v-if="downloading" class="m-2 bg-blue-500 text-gray-300 rounded px-4 py-2" @click="stopDownload">
          STOP
        </button>
        <button v-if="downloading" class="m-2 bg-blue-500 text-gray-300 rounded px-4 py-2" @click="pauseDownload">
          PAUSE
        </button>
        <button v-if="downloading" class="m-2 bg-blue-500 text-gray-300 rounded px-4 py-2" @click="resumeDownload">
          RESUME
        </button>

        <button v-if="!downloading" class=" m-2 bg-blue-500 text-gray-300 rounded px-4 py-2"
                @click="() => getInstallPath(true)"
        >
          SELECT INSTALL PATH
        </button>

        <label v-if="!downloading" class="inline-flex items-center mt-3">
          <input v-model="forceUpdate" checked class="form-checkbox h-5 w-5 text-blue-600" type="checkbox">
        </label>

        <button v-if="!downloading" class=" m-2 bg-blue-500 text-gray-300 rounded px-4 py-2" @click="startDownload">
          DOWNLOAD
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { DownloaderState } from '@emodyz/node-downloader'
import { remote } from 'electron'
import ProgressBar from '@/components/ProgressBar'

export default {
  components: {
    ProgressBar
  },
  transition: 'fade',
  head: {
    title: 'Server'
  },

  async fetch () {
    this.server = (await this.$axios.$get(`/servers/${this.id}`)).data
    this.module = new ((await import(`~/modules/${this.server.game.identifier}`)).default)()
    this.installPath = await this.module.findGamePath()
  },

  async asyncData ({ params }) {
    const id = params.id
    return { id }
  },

  data () {
    return {
      module: null,
      installPath: null,
      forceUpdate: false,
      downloading: false,
      downloader: null,
      speed: 0,
      progress: 0,
      progressCheck: 0,
      progressDownload: 0,
      checkServerInterval: null,
      server: null
    }
  },

  mounted () {
    this.downloader = this.$store.getters['downloaders/downloaderByServer'](this.id)
    this.handleDownloaderEvents()
    /** // TODO: Create route to fetch server status
    this.loadServer();
    this.checkServerInterval = setInterval(() => {
      this.loadServer()
    }, 30000) */
  },

  beforeDestroy () {
    // clearInterval(this.checkServerInterval) // TODO: Create route to fetch server status
    if (this.downloader) {
      this.downloader.off('progress', this.handleProgress)
      this.downloader.off('end', this.handleDownloaderEnded)
    }
  },

  methods: {
    getInstallPath (forceReselect = false) {
      if (!forceReselect && this.module.validateGamePath(this.installPath)) {
        return this.installPath
      }

      const installPath = remote.dialog.showOpenDialogSync({
        properties: ['openDirectory']
      })
      if (installPath && installPath.length > 0) {
        this.installPath = installPath.shift()
      }
      return this.installPath
    },

    async startDownload (forceReselect = false) {
      try {
        this.module.gamePath = this.getInstallPath(forceReselect === true)
      } catch (e) {
        console.log('Game path not valid!')
        if (forceReselect !== true) {
          await this.startDownload(true)
        }
        return
      }

      this.downloading = true;
      this.progress = 0;
      this.progressDownload = 0;
      this.progressCheck = 0;

      try {
        const modpacks = (await this.$axios.$get(`/servers/${this.id}/modpacks`)).data
        this.downloader = this.module.prepareDownload(modpacks)

        this.$store.commit('downloaders/add', {
          server: this.id,
          downloader: this.downloader
        })

        this.handleDownloaderEvents()
        this.$store.commit('downloaders/start', {
          server: this.id,
          forceDownload: this.forceUpdate
        })
      } catch (e) {
        console.error(e)
      }
    },

    pauseDownload () {
      this.$store.commit('downloaders/pause', this.id)
    },

    resumeDownload () {
      this.$store.commit('downloaders/resume', this.id)
    },

    stopDownload () {
      this.$store.commit('downloaders/stop', this.id)
      this.downloading = false
      this.progress = 0;
      this.progressDownload = 0;
      this.progressCheck = 0;
    },

    /**
     * Utils part
     */

    humanFileSize (bytes, si = false, dp = 1) {
      const thresh = si ? 1000 : 1024

      if (Math.abs(bytes) < thresh) {
        return bytes + ' B'
      }

      const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
      let u = -1
      const r = 10 ** dp

      do {
        bytes /= thresh
        ++u
      } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1)

      return bytes.toFixed(dp) + ' ' + units[u]
    },

    handleProgress (stats) {
      this.progressDownload = stats.progressDownload
      this.progress = stats.progressTotal
      this.progressCheck = stats.progressCheck
      this.speed = this.humanFileSize(stats.speed) + '/s'
    },

    handleDownloaderEnded () {
      this.downloading = false;
      this.progress = 0;
      this.progressDownload = 0;
      this.progressCheck = 0;
    },

    handleDownloaderEvents () {
      if (!this.downloader) {
        return
      }

      if (this.downloader.state !== DownloaderState.STAND_BY) {
        this.downloading = true
        this.progress = this.downloader.stats().progress
        this.progressDownload = this.downloader.stats().progressDownload
        this.progressCheck = this.downloader.stats().progressCheck
      }

      this.downloader.on('progress', this.handleProgress)
      this.downloader.on('end', this.handleDownloaderEnded)
    }
  }

}
</script>

<style scoped>
</style>
