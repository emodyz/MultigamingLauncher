<template>
  <div v-if="server" class="flex justify-center items-center content-center flex-col">
      <h1>{{server.name}}</h1>

      <div class="max-w-sm rounded overflow-hidden shadow-lg w-1/3 p-3">
        <div class="flex flex-col">
          <span class="font-bold underline">Players:</span>
          <span class="text-sm">Max: <span class="font-bold">{{server.status.players_online}}</span></span>
          <span class="text-sm">Online: <span class="font-bold">{{server.status.players_max}}</span></span>
        </div>
        <div class="flex flex-col pt-6">
          <span class="font-bold underline">Status:</span>
          <span v-if="server.status.online" class="text-center flex rounded bg-green-500 uppercase px-2 py-1 text-xs text-white font-bold mr-3">Online</span>
          <span v-if="!server.status.online" class="text-center flex rounded bg-red-500 uppercase px-2 py-1 text-xs text-white font-bold mr-3">Offline</span>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  transition: 'fade',

  async asyncData({ params }) {
    const id = params.id
    return { id };
  },

  data() {
    return {
      checkServerInterval: null,
      server: null,
    }
  },

  mounted() {
    this.loadServer();
    this.checkServerInterval = setInterval(() => {
      this.loadServer();
    },30000);
  },

  beforeDestroy() {
    clearInterval(this.checkServerInterval);
  },

  methods: {
    async loadServer() {
      try {
        this.server = (await this.$axios.$get(`/servers/${this.id}`)).data;
      } catch (e) {
        console.error(e);
      }
    }
  }

}
</script>

<style scoped>

</style>
