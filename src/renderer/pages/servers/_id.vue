<template>
  <div class="flex flex-row h-auto w-full p-4">
    <div class="w-3/4 pb-10">
      <span class="text-4xl font-bold text-white pl-3">
        News
      </span>
      <div class="container overflow-auto h-auto px-2">
        <div class="border border-gray-700 bg-gray-800 h-64 rounded mb-4 p-2">
          News 1
        </div>
        <div class="border border-gray-700 bg-gray-800 h-64 rounded mb-4 p-2">
          News 2
        </div>
        <div class="border border-gray-700 bg-gray-800 h-64 rounded mb-4 p-2">
          News 3
        </div>
      </div>
    </div>
    <div class="w-1/3">
      <span class="text-4xl font-bold text-white pl-3">
        Play
      </span>
      <div class="container px-2 h-full">
        <div class="flex flex-col border border-gray-700 bg-gray-800 h-32 rounded mb-4 p-2">
          <div v-if="downloader">
            <ProgressBar :progress="downloader.progress" class="mb-3" />
            <div class="flex flex-row justify-between items-end">
              <button class="rounded border border-acid-green text-gray-400 bg-gray-900 hover:bg-gray-800 px-2 mx-2" @click="stopDownload">
                STOP
              </button>
              <button class="rounded border border-acid-green text-gray-400 bg-gray-900 hover:bg-gray-800 px-2 mx-2" @click="pauseDownload">
                PAUSE
              </button>
              <button class="rounded border border-acid-green text-gray-400 bg-gray-900 hover:bg-gray-800 px-2 mx-2" @click="resumeDownload">
                RESUME
              </button>
            </div>
          </div>
          <div v-if="!downloader">
            <label class="inline-flex items-center mt-3">
              <input v-model="forceUpdate" checked class="form-checkbox h-5 w-5 text-blue-600" type="checkbox">
            </label>
            <button class="w-full rounded border border-acid-green text-gray-400 bg-gray-900 hover:bg-gray-800"
                    @click="startDownload"
            >
              Download
            </button>
          </div>
        </div>
        <div class="border border-gray-700 bg-gray-800 h-64 rounded" />
      </div>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron'
import { mapGetters } from 'vuex'
import ProgressBar from '@/components/ProgressBar'

export default {
  transition: 'fade',

  components: {
    ProgressBar
  },

  computed: {
    ...mapGetters('downloaders', [
      'downloaderByServer'
    ]),
    downloader () {
      return this.downloaderByServer(this.id)
    }
  },

  head () {
    return {
      title: `Server - ${this.server?.name || ''}`
    }
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
      checkServerInterval: null,
      server: null
    }
  },

  mounted () {
    this.$store.commit('page/setTitle', null);
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

      try {
        const modpacks = (await this.$axios.$get(`/servers/${this.id}/modpacks`)).data
        const downloader = this.module.prepareDownload(modpacks)

        this.$store.commit('downloaders/add', {
          server: this.server,
          downloader: downloader
        })

        this.$store.commit('downloaders/start', {
          serverId: this.id,
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
    }

  }
}
</script>

<style scoped>
</style>
