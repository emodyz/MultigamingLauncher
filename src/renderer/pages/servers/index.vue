<template>
  <transition-group
    class="flex justify-center flex-row flex-wrap"
    name="pop"
  >
    <div
      v-for="(server, index) in servers"
      :key="server.id"
      :data-index="index"
      class="relative flex flex-row items-center rounded overflow-hidden border-2 bg-gray-900 border-gray-800 mt-4 w-full m-5 w-1/3"
      style="max-height: 250px; max-width: 400px;"
    >
      <img :src="server.game.logo_url" class="w-2/5 h-full object-cover">

      <div class="flex items-center justify-center absolute top-0 right-0 m-3 z-10 select-none">
        <div class="cursor-pointer h-5 w-5">
          <svg v-if="!isFavorite(server.id)" class="stroke-current text-yellow-500" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" @click="favServer(server)">
            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
          </svg>
          <svg v-if="isFavorite(server.id)" class="fill-current stroke-current text-yellow-500" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" @click="unfavServer(server)">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>

        <span class="w-3 h-3 ml-1">
          <div v-if="server.status && server.status.online" class="flex relative">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-acid-green opacity-75" />
            <span class="relative inline-flex rounded-full h-3 w-3 bg-acid-green" />
          </div>
          <div v-if="server.status && !server.status.online" class="flex">
            <span class="relative inline-flex rounded-full h-3 w-3 bg-pink-500" />
          </div>
          <div v-if="!server.status" class="flex">
            <span class="relative inline-flex rounded-full h-3 w-3 bg-gray-700" />
          </div>
        </span>
      </div>
      <div class="relative flex flex-col items-center h-full w-full p-3">
        <span class="text-acid-green font-bold m-5 tracking-widest">
          {{ server.name }}
        </span>
        <div class="text-white tracking-wider h-40">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. In in condimentum nibh.
        </div>
        <div class="flex justify-center absolute bottom-0 w-full">
          <NuxtLink
            :to="'/servers/' + server.id"
            class="flex flex-col justify-center hover:bg-acid-green hover:text-gray-900 text-white font-bold
            py-1 px-4 rounded text-center acid-button w-full m-3"
          >
            JOIN
          </NuxtLink>
        </div>
      </div>
    </div>
  </transition-group>
</template>

<script>
import { mapGetters } from 'vuex'
const anime = require('animejs')

export default {
  name: 'Index',
  transition: 'fade',

  computed: {
    ...mapGetters('servers', [
      'isFavorite',
      'servers'
    ])
  },

  async created () {
    await this.$store.dispatch('servers/sync')
  },

  mounted () {
    this.$store.commit('page/setTitle', 'SERVERS')
  },

  methods: {
    enter (el, done) {
      console.log('cce')
      const delay = el.dataset.index * 150
      setTimeout(function () {
        anime({
          targets: el,
          opacity: 1,
          scale: [
            { value: 1 }
          ],
          duration: 500,
          complete: done
        })
      }, delay)
    },

    favServer (server) {
      this.$store.commit('servers/favServer', server.id)
    },

    unfavServer (server) {
      this.$store.commit('servers/unfavServer', server.id)
    }
  }

}
</script>

<style scoped>

.acid-button {
  border: 2px #CCFF00 solid;
  animation: morph 3s ease-in-out infinite;
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  height: 40px;
  transition: all 0.2s ease-in-out;
  width: 50%;
  z-index: 5;
}

@keyframes morph {
  0% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  }
  50% {
    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
  }
  100% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  }
}

</style>
