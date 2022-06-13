<template>
  <div class="absolute top-0 right-0 m-2 z-50 space-y-2">
    <div
      v-for="downloader of downloaders.filter((item) => !item.hidden)"
      :key="downloader.serverId"
      class="relative group bg-gray-100 border border-gray-200 text-gray-800 rounded overflow-hidden shadow-md w-64
          dark:bg-gray-800 dark:border-gray-700 dark:text-white"
    >
      <div class="absolute top-1 right-1 p-0">
        <ActionButton @click="hide(downloader.serverId)">
          <HideEyeIcon />
        </ActionButton>
      </div>
      <div class="flex flex-col w-full px-2 py-1">
        <div class="flex items-center h-14">
          <div class="flex">
            <img class="h-10 w-10 rounded-full" :src="server(downloader.serverId).game.logo_url">
            <div class="flex flex-col justify-center ml-4">
              <span class="font-semibold text-sm whitespace-nowrap truncate  ">
                {{ server(downloader.serverId).name }}
              </span>
              <span class="font-light text-xs">
                {{ server(downloader.serverId).game.name }}
              </span>
            </div>
          </div>
        </div>
        <ProgressBar
          show-progress
          :progress="downloader.progress"
          class="transition-all w-full h-5 group-hover:h-[1px]"
        >
          <div class="flex h-full text-xs items-center justify-center group-hover:hidden">
            <div>
              {{ downloader.progress.toFixed(0) }}%
            </div>
          </div>
        </ProgressBar>
        <div class="hidden group-hover:flex mt-1 justify-evenly items-center">
          <ActionButton v-if="isPaused(downloader)" class="w-4 h-4" @click="resume(downloader.serverId)">
            <PlayIcon />
          </ActionButton>
          <ActionButton v-if="isDownloading(downloader)" class="w-4 h-4" @click="pause(downloader.serverId)">
            <PauseIcon />
          </ActionButton>
          <ActionButton class="w-4 h-4" @click="stop(downloader.serverId)">
            <StopIcon />
          </ActionButton>
          <ActionButton @click="$router.push(`/servers/${downloader.serverId}`)">
            <ExternalLink />
          </ActionButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { DownloaderState } from '../../../../NodeDownloader'
import ProgressBar from '~/components/ProgressBar.vue'
import { downloadersStore, serverStore } from '~/store'
import PlayIcon from '~/components/icons/PlayIcon.vue'
import ActionButton from '~/components/buttons/ActionButton.vue'
import PauseIcon from '~/components/icons/PauseIcon.vue'
import StopIcon from '~/components/icons/StopIcon.vue'
import Downloader from '~/comunication/Downloader'
import HideEyeIcon from '~/components/icons/HideEyeIcon.vue'
import ExternalLink from '~/components/icons/ExternalLink.vue'

@Component({
  components: { ExternalLink, HideEyeIcon, StopIcon, PauseIcon, ActionButton, ProgressBar, PlayIcon }
})
export default class DownloaderOverlay extends Vue {
  get downloaders () {
    return downloadersStore.downloaders
  }

  get isDownloading () {
    return downloader => {
      return downloader.state === DownloaderState.DOWNLOADING
    }
  }

  get isPaused () {
    return downloader => {
      return downloader.state === DownloaderState.PAUSED
    }
  }

  hide (serverId: string) {
    downloadersStore.hide(serverId)
  }

  server (serverId: string) {
    return serverStore.server(serverId)
  }

  pause (serverId: string) {
    return new Downloader(serverId).pause()
  }

  resume (serverId: string) {
    return new Downloader(serverId).resume()
  }

  stop (serverId: string) {
    return new Downloader(serverId).stop()
  }
}
</script>

<style scoped>

</style>
