<template>
  <div class="absolute top-0 right-0 m-4 z-50">
    <div v-for="downloader of downloaders"
         :key="downloader.server.id"
         class="bg-gray-100 border border-gray-200 text-white max-w-sm rounded overflow-hidden shadow-md mt-3 w-64
          dark:bg-gray-800 dark:border-gray-700"
    >
      <NuxtLink :to="'/servers/' + downloader.server.id">
        <div class="flex flex-row h-full">
          <div class="w-2/5 h-24 border-r border-gray-200 dark:bg-gray-700">
            <img
              class="object-cover h-full"
              :src="downloader.server.logo_url"
            >
          </div>
          <div class="flex flex-col justify-between w-full px-2 py-4">
            <div class="self-start text-gray-900 dark:text-gray-100">
              {{ downloader.server.name }}
            </div>
            <ProgressBar :progress="downloader.progress" class="w-full self-end" />
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ProgressBar from '~/components/ProgressBar.vue'
import { downloadersStore } from '~/utils/store-accessor'

@Component({
  components: { ProgressBar }
})
export default class Downloader extends Vue {
  get downloaders () {
    return downloadersStore.downloaders
  }

  close () {
    // TODO: White method to hide downloader UI
  }
}
</script>

<style scoped>

</style>
