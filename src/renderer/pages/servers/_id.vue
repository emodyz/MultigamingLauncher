<template>
  <!--<div class="flex flex-row h-auto w-full p-4">
    <div class="w-3/4 pr-5">
      <span class="text-4xl font-bold text-white pl-3">
        News
      </span>
      <div class="w-full h-full mt-5">
        <news-slider :server-id="id" />
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
                class="rounded border border-indigo-400 text-gray-400 bg-gray-900 hover:bg-gray-800 px-2 mx-2"
                @click="stopDownload"
              >
                STOP
              </button>
              <button
                class="rounded border border-indigo-400 text-gray-400 bg-gray-900 hover:bg-gray-800 px-2 mx-2"
                @click="pauseDownload"
              >
                PAUSE
              </button>
              <button
                class="rounded border border-indigo-400 text-gray-400 bg-gray-900 hover:bg-gray-800 px-2 mx-2"
                @click="resumeDownload"
              >
                RESUME
              </button>
            </div>
          </div>
          <div v-if="!downloader">
            <label class="inline-flex items-center mt-3">
              <input v-model="forceUpdate" checked class="form-checkbox h-5 w-5 text-indigo-600" type="checkbox">
            </label>
            <button class="w-full rounded border border-indigo-400 text-gray-400 bg-gray-900 hover:bg-gray-800"
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
  </div>-->
  <div class="flex flex-col justify-between h-full">
    <div class="flex items-center text-white h-40 w-full p-4">
      <div v-if="server" class="flex">
        <img class="h-20 w-20 rounded-lg" :src="server.logo_url">
        <div class="flex flex-col justify-center  ml-4">
          <span class="font-semibold">
            {{ server.name }}
          </span>
          <span class="font-light">
            {{ server.game.name }}
          </span>
        </div>
      </div>
    </div>
    <div class="flex h-full w-full p-2">
      <div class="h-full w-2/3">
        <news-slider :server-id="id" />
      </div>
      <div class="h-full w-1/3 ml-2">
        <div class="w-full h-full bg-gray-800 text-gray-50 rounded-md p-4 uppercase flex items-center justify-center
        border-2 border-gray-700"
        >
          Plugins available soon.
        </div>
      </div>
    </div>
    <div class="flex h-44 w-full p-2">
      <div class="flex items-center w-1/4 p-2">
        <!-- Download Button --->
        <button v-if="server && hasUpdate(id, server.update_hash)" class="w-full h-full font-light uppercase
        text-3xl rounded-md bg-gray-800 text-indigo-400 border-2
        border-gray-700 hover:bg-gray-700 focus:outline-none" @click="startDownload"
        >
          Download
        </button>
        <!--- Play Button --->
        <button v-else class="w-full h-full font-light uppercase text-3xl rounded-md bg-gray-800
        text-indigo-400 border-2 border-gray-700 hover:bg-gray-700 focus:outline-none" @click="startDownload"
        >
          Play
        </button>
      </div>
      <div class="flex items-center w-3/4 p-2">
        <div v-if="downloader" class="flex w-full">
          <progress-bar :progress="downloader.progress" class="w-full" />

          <!-- Pause Button -->
          <button v-if="downloader.state === 0" class="ml-2 w-7 h-7 bg-gray-600
          rounded-md text-indigo-400 hover:text-green-200
          hover:bg-gray-700 focus:outline-none" @click="pauseDownload"
          >
            <svg class="stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 7v10m5-10v10m5-1a9 0z" />
            </svg>
          </button>
          <!-- Resume Button -->
          <button v-else-if="downloader.state === 1" class="ml-2 w-7 h-7 bg-gray-600
          rounded-md text-indigo-400 hover:text-green-200
          hover:bg-gray-700 focus:outline-none" @click="resumeDownload"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="4 4 16 16" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M14.752 11.168l-3.197-2.132A1
              1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
            </svg>
          </button>

          <!-- Stop Button -->
          <button class="ml-2 w-7 h-7 p-1 bg-gray-600 rounded-md text-indigo-400 hover:text-green-200
          hover:bg-gray-700 focus:outline-none" @click="stopDownload"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0
              005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { remote } from 'electron'
import { Component, Vue } from 'vue-property-decorator'
import ProgressBar from '@/components/ProgressBar.vue'
import { downloadersStore, updaterStore, pageStore } from '@/store'
import NewsSlider from '@/components/news/news-slider.vue'

@Component({
  transition: 'fade',
  components: {
    NewsSlider,
    ProgressBar
  },

  head () {
    return {
      // @ts-ignore
      title: `Server - ${this.server?.name || ''}`
    }
  },

  async asyncData ({ params }) {
    const id = params.id
    return { id }
  },

  async fetch () {
    // @ts-ignore
    this.server = (await this.$axios.$get(`/servers/${this.id}`)).data
    // @ts-ignore
    // eslint-disable-next-line new-cap
    this.module = new ((await import(`~/modules/${this.server.game.identifier}`)).default)()
    // @ts-ignore
    this.installPath = await this.module.findGamePath()
  }
})
export default class Server extends Vue {
  module: any = null;
  installPath: string | null = null;
  forceUpdate = true;
  checkServerInterval = null;
  server = null;

  // @ts-ignore
  id: string;

  get hasUpdate () {
    return updaterStore.hasUpdate
  }

  get downloader () {
    return downloadersStore.downloaderByServer(this.id)
  }

  mounted () {
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
      this.installPath = installPath.shift() || null
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
