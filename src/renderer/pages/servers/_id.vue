<template>
  <div class="flex flex-row h-auto w-full p-4">
    <div class="w-3/4 pr-5">
      <span class="text-4xl font-bold text-white pl-3">
        News
      </span>
      <div class="w-full h-full mt-5">
        <news-slider />
      </div>
    </div>
    <div class="w-1/3">
      <span class="text-4xl font-bold text-white pl-3">
        Play
      </span>
      <div class="mt-5 px-2 h-full">
        <div class="flex flex-col border border-gray-700 bg-gray-800 h-32 rounded mb-4 p-2">
          <div v-if="server">
            {{ hasUpdate(id, server.update_hash) }}
          </div>
          <div v-if="downloader">
            <ProgressBar :progress="downloader.progress" class="mb-3" />
            <div class="flex flex-row justify-between items-end">
              <button
                class="rounded border border-acid-green text-gray-400 bg-gray-900 hover:bg-gray-800 px-2 mx-2"
                @click="stopDownload"
              >
                STOP
              </button>
              <button
                class="rounded border border-acid-green text-gray-400 bg-gray-900 hover:bg-gray-800 px-2 mx-2"
                @click="pauseDownload"
              >
                PAUSE
              </button>
              <button
                class="rounded border border-acid-green text-gray-400 bg-gray-900 hover:bg-gray-800 px-2 mx-2"
                @click="resumeDownload"
              >
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
        <div class="border border-gray-700 bg-gray-800 h-64 rounded p-3">
          <div v-if="server && server.status">
            <span class="text-white block font-bold">Is online: {{ server.status.online }}</span>
            <span class="text-white block font-thin">Slots: {{ server.status.players_max }}</span>
            <span class="text-white block font-thin">Online: {{ server.status.players_online }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { remote } from 'electron'
import { Component, Vue } from 'vue-property-decorator'
import ProgressBar from '@/components/ProgressBar'
import NewsSlider from '@/components/news/news-slider'
import { downloadersStore, updaterStore, pageStore } from '~/store'

@Component({
  transition: 'fade',
  components: {
    NewsSlider,
    ProgressBar
  },

  head () {
    return {
      title: `Server - ${this.server?.name || ''}`
    }
  },

  async asyncData ({ params }) {
    const id = params.id
    return { id }
  },

  async fetch () {
    this.server = (await this.$axios.$get(`/servers/${this.id}`)).data
    // eslint-disable-next-line new-cap
    this.module = new ((await import(`~/modules/${this.server.game.identifier}`)).default)()
    this.installPath = await this.module.findGamePath()
  }
})
export default class Server extends Vue {
  module = null;
  installPath = null;
  forceUpdate = false;
  checkServerInterval = null;
  server = null;

  get hasUpdate () {
    return updaterStore.hasUpdate
  }

  get downloader () {
    return downloadersStore.downloaderByServer(this.id)
  }

  mounted () {
    console.log(this.id)
    pageStore.setTitle(null)
  }

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
  }

  async startDownload (forceReselect = false) {
    try {
      this.module.gamePath = this.getInstallPath(forceReselect)
    } catch (e) {
      console.log('Game path not valid!')
      if (!forceReselect) {
        await this.startDownload(true)
      }
      return
    }

    try {
      const modpacks = (await this.$axios.$get(`/servers/${this.id}/modpacks`)).data
      const downloader = this.module.prepareDownload(modpacks)

      if (this.forceUpdate) {
        updaterStore.remove(this.id)
      }

      downloadersStore.add({
        server: this.server,
        downloader
      })

      downloadersStore.start({
        serverId: this.id,
        forceDownload: this.forceUpdate
      })
    } catch (e) {
      console.error(e)
    }
  }

  pauseDownload () {
    downloadersStore.pause(this.id)
  }

  resumeDownload () {
    downloadersStore.resume(this.id)
  }

  stopDownload () {
    downloadersStore.stop(this.id)
  }
}
</script>

<style scoped>
</style>
