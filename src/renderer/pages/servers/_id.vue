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

    <div v-if="downloading">
      <div class="flex flex-col items-center justify-center content-center">
        <span>{{ speed }}</span>
        <span v-if="this.downloader">{{ this.downloader.filesDownloaded }} / {{ this.downloader.filesToDownload }}</span>
      </div>
      <div class="relative pt-1">
        <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-200">
          <div :style="'width: ' + totalProgress + '%'" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500 progress-animation" />
        </div>
      </div>
      <div class="relative pt-1">
        <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-teal-200">
          <div :style="'width: ' + progress + '%'" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500 progress-animation" />
        </div>
      </div>
    </div>

    <div class="flex items-center flex-row justify-center shadow-lg absolute bottom-0 left-0 right-0 h-20">
      <button v-if="progress" class="m-2 bg-blue-500 text-gray-300 rounded px-4 py-2" @click="stopDownload">STOP</button>
      <button v-if="progress" class="m-2 bg-blue-500 text-gray-300 rounded px-4 py-2" @click="pauseDownload">PAUSE</button>
      <button v-if="progress" class="m-2 bg-blue-500 text-gray-300 rounded px-4 py-2" @click="resumeDownload">RESUME</button>
      <button :disabled="downloading" class=" m-2 bg-blue-500 text-gray-300 rounded px-4 py-2" @click="startDownload">DOWNLOAD</button>
    </div>
  </div>
</template>

<script>
import {createDownloader} from '@emodyz/node-downloader'

export default {
  transition: 'fade',

  async asyncData ({ params }) {
    const id = params.id
    return { id }
  },

  data () {
    return {
      downloader: null,
      downloading: false,
      speed: 0,
      totalProgress: 0,
      progress: 0,
      checkServerInterval: null,
      server: null
    }
  },

  mounted () {
    this.loadServer()
    this.checkServerInterval = setInterval(() => {
      this.loadServer()
    }, 30000)
  },

  beforeDestroy () {
    clearInterval(this.checkServerInterval)
    this.stopDownload()
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

    startDownload () {
      this.downloading = true
      this.totalProgress = 0
      this.progress = 0
      this.$axios.$get(`/servers/${this.id}/modpacks`)
        .then(res => res.data)
        .then(modpacks => {
          this.downloader = createDownloader({ httpsRequestOptions: { rejectUnauthorized: false } })
          this.downloader.simultaneusDownloads = 1

          modpacks.forEach(modpack => {
            const manifest = Object.values(modpack.manifest)

            manifest.forEach(file => {
              this.downloader.addFile(file.url, '/Users/hubert_i/Downloads/test')
            })
          })

          this.downloader.on('progress.total', stats => {
            this.totalProgress = stats.progress
          })

          this.downloader.on('progress', stats => {
            this.progress = stats.progress
            this.speed = this.humanFileSize(stats.speed) + '/s'
            console.log(this.progress)
          })

          this.downloader.on('end', stats => {
            this.downloading = false
            this.totalProgress = 0
            this.progress = 0
          })

          this.downloader.start()
        }).catch(e => console.log(e))
    },

    pauseDownload () {
      this.downloader.pause()
    },

    resumeDownload () {
      this.downloader.resume()
    },

    stopDownload () {
      this.downloader.stop()
      this.downloading = false
      this.totalProgress = 0
      this.progress = 0
    }
  }

}
</script>

<style scoped>

.progress-animation {
  transition: width 200ms;
}

</style>
