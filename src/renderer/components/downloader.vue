<template>
  <div class="absolute bottom-0 right-0 m-4 w-1/6">
    <div v-for="[serverId, downloader] of downloaders" class="max-w-sm rounded overflow-hidden shadow-md mt-3" >
      <div class="w-full flex flex-row justify-end">
        <svg class="fill-current h-6 w-6 text-orange-400" role="button" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
      </div>
      <div class="p-2">
        <ProgressBar :progress="progresses.get(serverId)"></ProgressBar>
        <div class="flex justify-center pt-1">
          <NuxtLink :to="'/servers/' + serverId" class="bg-blue-500 hover:bg-blue-700 text-xs text-white font-bold rounded w-full text-center">
            SEE
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressBar from "@/components/ProgressBar";

export default {
  name: "downloader",
  components: {
    ProgressBar
  },

  data() {
    return {
    }
  },

  computed: {
    progresses () {
      return this.$store.state.downloaders.progresses
    },
    downloaders () {
      return this.$store.state.downloaders.list
    }
  },

  methods: {
    close() {

    }
  }
}
</script>

<style scoped>

</style>
