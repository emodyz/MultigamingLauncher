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
        <div
          class="w-full h-full bg-gray-100 shadow-md text-gray-900 rounded-md uppercase
        border border-gray-200 dark:border-transparent dark:bg-gray-800 dark:text-gray-50"
        >
          <server-status :server="server" />
        </div>
      </div>
    </div>
    <div class="flex h-32 w-full p-2">
      <div class="flex items-center w-50 p-2">
        <jet-button
          v-if="!isReady"
          disabled
          class="w-full h-full font-light uppercase text-base lg:text-xl xl:text-2xl 2xl:text-3xl"
        >
          Loading ...
        </jet-button>
        <!-- Download Button --->
        <jet-button
          v-else-if="(server && hasUpdate(id, server.update_hash)) || forceUpdate" :disabled="downloadInProgress"
          class="w-full h-full font-light uppercase
                    text-base lg:text-xl xl:text-2xl 2xl:text-3xl" @click="startDownload()"
        >
          <span v-if="!downloadInProgress" class="flex">
            Download
            <DownloadIcon class="w-5 ml-2 lg:w-6 xl:w-7 2xl:w-8" />
          </span>
          <span v-else>Downloading...</span>
        </jet-button>
        <!--- Play Button --->
        <jet-button
          v-else
          class="w-full h-full font-light uppercase text-3xl"
          :disabled="isGameRunning"
          @click="startGame"
        >
          <span v-if="!isGameRunning" class="flex">
            Play
            <PlayIcon class="w-7 ml-2 lg:w-6 xl:w-7 2xl:w-8" />
          </span>
          <span v-else class="flex">
            Game is running
          </span>
        </jet-button>
      </div>
      <div class="flex items-center w-3/4 p-2">
        <div v-if="downloadInProgress" class="flex w-full">
          <progress-bar :progress="downloader.progress" class="w-full h-7" />

          <!-- Pause Button -->
          <ActionButton
            v-if="isDownloading"
            @click="pauseDownload"
          >
            <PauseIcon />
          </ActionButton>
          <!-- Resume Button -->
          <ActionButton
            v-else-if="isPaused"
            @click="resumeDownload"
          >
            <PlayIcon />
          </ActionButton>

          <!-- Stop Button -->
          <ActionButton
            @click="stopDownload"
          >
            <StopIcon />
          </ActionButton>
        </div>
        <div v-if="!downloader" class="flex h-full flex-col justify-end">
          <div v-if="!isGameRunning && server && !hasUpdate(id, server.update_hash)" class="self-start">
            <span class="text-gray-900 dark:text-gray-100 flex justify-center items-center">
              <jet-checkbox v-model="forceUpdate" class="mr-2" />
              Force download.
            </span>
          </div>

          <div v-if="isGameRunning" class="self-start items-center">
            <a
              class="text-gray-700 underline cursor-pointer hover:text-gray-300 dark:text-red-500
                 dark:hover:text-indigo-500"
              @click="killGame"
            >
              Force kill the game
            </a>
          </div>

          <div class="mt-2">
            <a
              class="text-gray-700 underline cursor-pointer hover:text-gray-300 dark:text-indigo-400
                 dark:hover:text-indigo-500"
              @click="openGamePathSelector = true"
            >
              Open game path installer
            </a>
          </div>
        </div>
      </div>
    </div>
    <GamePathSelector
      v-if="server"
      :game="server.game"
      :module="module"
      :opened="openGamePathSelector"
      :saved-game-path="savedGamePath"
      @confirmed="startDownload"
      @closed="openGamePathSelector = false"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { DownloaderState } from '../../../sdk/Sdk'
import ProgressBar from '@/components/ProgressBar.vue'
import { updaterStore, pageStore, gamesStore, downloadersStore } from '@/store'
import NewsSlider from '@/components/news/news-slider.vue'
import JetButton from '~/components/JetStream/Button.vue'
import JetCheckbox from '~/components/JetStream/Checkbox.vue'
import ServerStatus from '~/components/plugins/ServerStatus.vue'
import GamePathSelector from '~/pages/servers/components/GamePathSelector.vue'
import PlayIcon from '~/components/icons/PlayIcon.vue'
import DownloadIcon from '~/components/icons/DownloadIcon.vue'
import StopIcon from '~/components/icons/StopIcon.vue'
import PauseIcon from '~/components/icons/PauseIcon.vue'
import GameModule from '~/comunication/GameModule'
import ActionButton from '~/components/buttons/ActionButton.vue'

@Component({
  transition: 'fade',
  components: {
    ActionButton,
    PauseIcon,
    StopIcon,
    DownloadIcon,
    PlayIcon,
    GamePathSelector,
    ServerStatus,
    JetCheckbox,
    NewsSlider,
    ProgressBar,
    JetButton
  },

  head () {
    return {
      // @ts-ignore
      title: `${this.server?.game?.name || ''} - ${this.server?.name || ''}`
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
    this.module = new GameModule(this.server.game.identifier)

    // @ts-ignore
    await this.module.checkGamePath(this.savedGamePath)
  }
})
export default class Server extends Vue {
  openGamePathSelector: boolean = false

  module: GameModule | null = null

  forceUpdate = false
  checkServerInterval = null
  server: any = null

  isGameRunning: boolean = false

  _gameCheckerInterval!: any

  // @ts-ignore
  id: string

  get isReady () {
    return this.server && this.module
  }

  get isDownloading () {
    return this.downloader.state === DownloaderState.DOWNLOADING
  }

  get isPaused () {
    return this.downloader.state === DownloaderState.PAUSED
  }

  get hasUpdate () {
    return updaterStore.hasUpdate
  }

  get downloader () {
    return downloadersStore.downloaderByServer(this.id)
  }

  get savedGamePath () {
    return gamesStore.gamePathByServerAndGameId(this.server.id)
  }

  get downloadInProgress () {
    return this.downloader !== undefined
  }

  async mounted () {
    pageStore.setTitle(null)
    await this.checkIfGameRunning()
    this._gameCheckerInterval = setInterval(async () => {
      await this.checkIfGameRunning()
      console.log('isRunnig', this.isGameRunning)
    }, 4000)
  }

  destroyed () {
    this.module?.destroy()
    if (this._gameCheckerInterval) {
      clearInterval(this._gameCheckerInterval)
    }
  }

  async checkIfGameRunning () {
    if (!this.module) {
      this.isGameRunning = false
      return false
    }
    this.isGameRunning = await this.module.isGameRunning()
    return this.isGameRunning
  }

  killGame () {
    /**
    if (this.module) {
      this.module.kill()
    }
     */ // TODO
  }

  async startDownload (installPath: string | null = null) {
    if (!this.module) {
      console.error('Game module not found.')
      return
    }

    if (!this.savedGamePath && !installPath) {
      this.openGamePathSelector = true
      return
    }

    if (!await this.module.checkGamePath(installPath || this.savedGamePath || '')) {
      this.openGamePathSelector = true
      return
    }

    if (installPath) {
      gamesStore.add({
        serverId: this.server.id,
        gameId: this.server.game.identifier,
        gamePath: installPath
      })
    }

    try {
      const modPacks = (await this.$axios.$get(`/servers/${this.server.id}/modpacks`)).data

      const filesToDownload = modPacks.map(modpack => modpack.manifest.length).reduce((a, b) => a + b, 0)
      if (filesToDownload === 0) {
        alert('Empty ModPack, please contact an administrator...')
        return
      }

      await this.module.createDownloader(this.server.id, modPacks)

      await this.downloader.downloader.start(this.forceUpdate)
    } catch (err) {
      console.error(err)
    } finally {
      this.forceUpdate = false
    }
  }

  pauseDownload () {
    if (!module) {
      return
    }

    this.downloader.downloader.pause()
  }

  resumeDownload () {
    this.downloader.downloader.resume()
  }

  stopDownload () {
    this.downloader.downloader.stop()
  }

  async startGame () {
    /** if (!this.module) {
      console.error('Game module not found.')
      return
    }

    if (!this.module.checkGamePath(this.savedGamePath || '')) {
      this.openGamePathSelector = true
      return
    }

    // this.module.gamePath = this.savedGamePath || ''

    const modPacks = (await this.$axios.$get(`/servers/${this.id}/modpacks`)).data
    await this.module.play(modPacks, this.server) */
  }
}
</script>

<style scoped>
</style>
