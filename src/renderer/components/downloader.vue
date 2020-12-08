<template>
  <div class="absolute bottom-0 right-0 m-4 z-10">
    <div v-for="downloader of downloaders"
         :key="downloader.server.id"
         class="bg-gray-800 border-acid-green border text-white max-w-sm rounded overflow-hidden shadow-md mt-3  w-64"
    >
      <NuxtLink :to="'/servers/' + downloader.server.id">
        <div class="flex flex-row h-full">
          <div class="w-2/5 p-2 h-24 border-r border-gray-700">
            <img class="rounded object-cover h-full" src="https://jeuxx-gratuit.fr/wp-content/uploads/2019/07/Arma-3-download.png">
          </div>
          <div class="w-full px-2 py-4 flex flex-col items-center justify-center">
            <ProgressBar :progress="downloader.progress" class="w-full" />
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ProgressBar from '@/components/ProgressBar'

export default {
  name: 'Downloader',
  components: {
    ProgressBar
  },

  computed: {
    ...mapGetters('downloaders', [
      'downloaders'
    ])
  },

  methods: {
    close () {
      // TODO: White method to hide downloader UI
    }
  }
}
</script>

<style scoped>

</style>
