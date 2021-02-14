<template>
  <div class="flex flex-col justify-between h-full">
    <div class="flex items-center text-gray-900 h-40 w-full p-4 dark:text-white">
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
        <div class="w-full h-full bg-gray-100 shadow-md text-gray-900 rounded-md uppercase
        border border-gray-200 dark:border-transparent dark:bg-gray-800 dark:text-gray-50"
        >
          <server-status :server="server" />
        </div>
      </div>
    </div>
    <div class="flex h-44 w-full p-2">
      <div class="flex items-center w-1/4 p-2">
        <!-- Download Button --->
        <jet-button v-if="(server && hasUpdate(id, server.update_hash)) || forceUpdate" :disabled="downloadInProgress"
                    class="w-full h-full font-light uppercase
                    text-base lg:text-xl xl:text-2xl 2xl:text-3xl" @click="startDownload(false)"
        >
          <span v-if="!downloadInProgress">Download</span>
          <span v-else>Downloading...</span>
        </jet-button>
        <!--- Play Button --->
        <jet-button v-else class="w-full h-full font-light uppercase text-3xl" @click="startDownload(false)">
          Play
        </jet-button>
      </div>
      <div class="flex items-center w-3/4 p-2">
        <div v-if="downloadInProgress" class="flex w-full">
          <progress-bar :progress="downloader.progress" class="w-full h-7" />

          <!-- Pause Button -->
          <button v-if="downloader.state === 0" class="ml-2 w-7 h-7 bg-gray-200
          rounded-md text-gray-500 hover:text-gray-900
          hover:bg-gray-300 focus:outline-none dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                  @click="pauseDownload"
          >
            <svg class="stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 7v10m5-10v10m5-1a9 0z" />
            </svg>
          </button>
          <!-- Resume Button -->
          <button v-else-if="downloader.state === 1" class="ml-2 w-7 h-7 bg-gray-200
          rounded-md text-gray-500 hover:text-gray-900
          hover:bg-gray-300 focus:outline-none dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                  @click="resumeDownload"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="4 4 16 16" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M14.752 11.168l-3.197-2.132A1
              1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
            </svg>
          </button>

          <!-- Stop Button -->
          <button class="ml-2 w-7 h-7 p-1 bg-gray-200 rounded-md text-gray-500 hover:text-gray-900
          hover:bg-gray-300 focus:outline-none dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                  @click="stopDownload"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0
              005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </button>
        </div>
        <div v-else-if="!downloader && (server && !hasUpdate(id, server.update_hash))">
          <span class="text-gray-900 dark:text-gray-100 flex justify-center items-center">
            <jet-checkbox v-model="forceUpdate" class="mr-2" />
            Force download.
          </span>
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
import JetButton from '~/components/JetStream/Button.vue'
import JetCheckbox from '~/components/JetStream/Checkbox.vue'
import ServerStatus from '~/components/plugins/ServerStatus.vue'

@Component({
  transition: 'fade',
  components: {
    ServerStatus,
    JetCheckbox,
    NewsSlider,
    ProgressBar,
    JetButton
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
  forceUpdate = false;
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

  get downloadInProgress () {
    return this.downloader !== undefined
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
