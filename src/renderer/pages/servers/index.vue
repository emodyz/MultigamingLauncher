<template>
  <transition-group
    class="flex justify-center flex-row flex-wrap"
    name="pop"
    @enter="enter"
  >
    <div
      v-for="(server, index) in servers"
      :key="server.id"
      :data-index="index"
      class="relative flex flex-row items-center rounded overflow-hidden border-2 bg-gray-900 border-gray-800 mt-4 w-full m-5 w-1/3 test"
      style="max-height: 250px; max-width: 400px; transform: scale(0.7); opacity: 0;"
    >
      <img class="w-2/5 h-full" src="https://cdn.cdkeys.com/media/catalog/product/a/r/arma_3_pc_apex_dlc_cover.jpg">
      <span class="absolute top-0 right-0 w-3 h-3 m-4">
        <div v-if="server.status && server.status.online" class="flex">
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
const anime = require('animejs')

export default {
  name: 'Index',
  transition: 'fade',

  data () {
    return {
      servers: []
    }
  },

  mounted () {
    this.$store.commit('page/setTitle', 'SERVERS')
    this.loadServers()
  },

  methods: {
    async loadServers () {
      try {
        this.servers = (await this.$axios.$get('/servers')).data
      } catch (e) {
        console.error(e)
      }
    },
    enter (el, done) {
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
