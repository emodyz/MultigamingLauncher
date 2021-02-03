<template>
  <transition-group
    class="flex justify-center flex-row flex-wrap"
    name="fade"
  >
    <div
      v-for="(server) in servers"
      :key="server.id"
      style="width: 350px;"
    >
      <div class="relative p-4 md:w-full md:mb-0 mb-6 flex flex-col justify-center items-center max-w-sm mx-auto">
        <div class="bg-gray-300 h-56 w-full rounded-lg shadow-md bg-cover bg-center"
             :style="`background-image: url('${ server.logo_url }')`"
        />

        <div class="relative w-72 h-24 bg-white -mt-10 shadow-lg rounded-lg p-2 dark:bg-gray-800">
          <img :src="server.game.logo_url" class="absolute ring-4 ring-white rounded-md -top-5 left-5 z-20 w-10 h-10 dark:ring-gray-800">

          <div class="overflow-hidden pt-5">
            <div class="flex items-center justify-center absolute top-2 right-2 z-10 select-none">
              <div class="cursor-pointer h-5 w-5">
                <svg
                  v-if="!isFavorite(server.id)"
                  class="stroke-current text-yellow-500"
                  fill="none" viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg" @click="favServer(server)"
                >
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0
                  1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538
                  1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0
                  00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  />
                </svg>
                <svg
                  v-if="isFavorite(server.id)"
                  class="fill-current stroke-current text-yellow-500"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  @click="unfavServer(server)"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588
            1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175
            0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1
            0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              </div>

              <span class="w-3 h-3 ml-1">
                <div v-if="server.status && server.status.online" class="flex relative">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                </div>
                <div v-else-if="server.status && !server.status.online" class="flex relative">
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                </div>
                <div v-else class="flex">
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-gray-700" />
                </div>
              </span>
            </div>

            <div class="title-post font-medium w-full dark:text-gray-100">
              {{ server.name }}
            </div>

            <div class="absolute bottom-2 right-1/3 left-1/3 text-base text-justify">
              <NuxtLink
                :to="'/servers/' + server.id"
              >
                <jet-button class="block w-full justify-center">
                  Play
                </jet-button>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition-group>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { serverStore, pageStore } from '~/store'
import JetButton from '~/components/JetStream/Button.vue'

@Component({
  components: {
    JetButton
  },
  transition: 'fade'
})
export default class Servers extends Vue {
  get servers () {
    return serverStore.servers
  }

  get isFavorite () {
    return serverStore.isFavorite
  }

  async created () {
    await serverStore.sync()
  }

  mounted () {
    pageStore.setTitle('SERVERS')
  }

  favServer (server) {
    serverStore.favServer(server.id)
  }

  unfavServer (server) {
    serverStore.unfavServer(server.id)
  }
}
</script>
