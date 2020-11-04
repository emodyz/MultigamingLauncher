<template>
  <div class="flex justify-center">
    <div v-for="server in servers" class="flex flex-col items-center m-4 w-1/3">
      <img :src="server.game.logo_url" class="rounded w-20">
      <span>{{server.name}}</span>

      <NuxtLink :to="'/servers/' + server.id">
        <button class="bg-blue hover:bg-blue text-blue-dark font-semibold hover:text-blue py-2 px-4 border border-blue hover:border-transparent rounded">
          PLAY
        </button>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",

  data() {
    return {
      servers: []
    }
  },

  mounted() {
    this.loadServers();
  },

  methods: {
    async loadServers() {
      try {
        this.servers = (await this.$axios.$get('/servers')).data;
      } catch (e) {
        console.error(e);
      }
    }
  }

}
</script>

<style scoped>

</style>
