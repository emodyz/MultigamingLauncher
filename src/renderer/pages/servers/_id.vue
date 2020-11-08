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
          <span v-if="server.status.online" class="text-center flex rounded bg-green-500 uppercase px-2 py-1 text-xs text-white font-bold mr-3">Online</span>
          <span v-if="!server.status.online" class="text-center flex rounded bg-red-500 uppercase px-2 py-1 text-xs text-white font-bold mr-3">Offline</span>
        </div>
      </div>
    </div>

    <div class="flex items-center flex-col justify-center shadow-lg absolute bottom-0 left-0 right-0" style="z-index: 1">
      <div v-if="downloading" class="w-full p-3">
        <div class="flex flex-col items-center justify-center content-center">
          <span>{{ speed }}</span>
          <span v-if="this.downloader">{{ this.downloader.filesDownloaded }} / {{ this.downloader.filesToDownload }}</span>
        </div>
        <ProgressBar :progress="progress" />
      </div>
      <div class="flex flex-row">
        <button v-if="downloading" class="m-2 bg-blue-500 text-gray-300 rounded px-4 py-2" @click="stopDownload">STOP</button>
        <button v-if="downloading" class="m-2 bg-blue-500 text-gray-300 rounded px-4 py-2" @click="pauseDownload">PAUSE</button>
        <button v-if="downloading" class="m-2 bg-blue-500 text-gray-300 rounded px-4 py-2" @click="resumeDownload">RESUME</button>
        <button v-if="!downloading" class=" m-2 bg-blue-500 text-gray-300 rounded px-4 py-2" @click="startDownload">DOWNLOAD</button>
      </div>
    </div>
  </div>
</template>

<script>
import {createDownloader, DownloaderState} from '@emodyz/node-downloader'
import ProgressBar from '@/components/ProgressBar'

export default {
  components: {
    ProgressBar
  },
  transition: 'fade',

  async asyncData ({ params }) {
    const id = params.id
    return { id }
  },

  data () {
    return {
      downloading: false,
      downloader: null,
      speed: 0,
      progress: 0,
      checkServerInterval: null,
      server: null
    }
  },

  mounted () {
    this.downloader = this.$store.getters['downloaders/downloaderByServer'](this.id)
    this.handleDownloaderEvents()
    this.loadServer()
    this.checkServerInterval = setInterval(() => {
      this.loadServer()
    }, 30000)
  },

  beforeDestroy () {
    clearInterval(this.checkServerInterval)
    this.downloader.off('progress', this.handleProgress)
    this.downloader.off('end', this.handleDownloaderEnded)
  },

  methods: {
    async loadServer () {
      try {
        this.server = (await this.$axios.$get(`/servers/${this.id}`)).data
      } catch (e) {
        console.error(e)
      }
    },

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
      this.progress = stats.progressTotal
      this.speed = this.humanFileSize(stats.speed) + '/s'
    },

    handleDownloaderEnded (downloadInfo) {
      this.downloading = false
      this.progress = 0
    },

    handleDownloaderEvents () {
      if (!this.downloader) {
        return
      }

      if (this.downloader.state !== DownloaderState.STAND_BY) {
        this.downloading = true
        this.progress = this.downloader.stats().progress
      }

      this.downloader.on('progress', this.handleProgress)
      this.downloader.on('end', this.handleDownloaderEnded)
    },

    startDownload () {
      this.downloading = true
      this.progress = 0
      this.$axios.$get(`/servers/${this.id}/modpacks`)
        .then(res => res.data)
        .then(modpacks => {
          this.downloader = createDownloader()

          modpacks.forEach(modpack => {
            const manifest = Object.values(modpack.manifest)

            manifest.forEach(file => {
              this.downloader.addFile(file.url, '/Users/hubert_i/Downloads/test')
            })
          })

          this.$store.commit('downloaders/add', {
            server: this.id,
            downloader: this.downloader
          })

          this.handleDownloaderEvents()
          this.$store.commit('downloaders/start', this.id)
        }).catch(e => console.log(e))
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
      this.progress = 0
    }
  }

}
</script>

<style scoped>
</style>
