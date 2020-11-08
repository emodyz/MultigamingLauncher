<template>
  <div class="flex justify-center md:flex-row flex-col">
    <div v-for="server in servers"
         :key="server.id"
         class="flex flex-col items-center rounded overflow-hidden shadow-lg mt-4 w-full
         p-4 md:w-1/2 lg:w-1/3 md:mt-0 md:m-2"
    >
      <div class="mb-2 flex flex-col items-center">
        <span class="font-bold">{{ server.name }}</span>
        <img :src="server.game.logo_url" class="rounded w-20">
      </div>

      <div v-if="server.status" class="flex items-center">
        <span v-if="server.status.online"
              class="flex rounded bg-green-500 uppercase px-2 py-1 text-xs text-white font-bold"
        >Online</span>
        <span v-if="!server.status.online"
              class="flex rounded bg-red-500 uppercase px-2 py-1 text-xs text-white font-bold"
        >Offline</span>
      </div>

      <div class="flex w-full mt-2">
        <NuxtLink :to="'/servers/' + server.id"
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded w-full text-center"
        >
          JOIN
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  transition: 'fade',

  data () {
    return {
      servers: []
    }
  },

  mounted () {
    this.loadServers()
  },

  methods: {
    async loadServers () {
      try {
        this.servers = (await this.$axios.$get('/servers')).data
      } catch (e) {
        console.error(e)
      }
    }
  }

}
</script>

<style scoped>

</style>
