<template>
  <div class="flex justify-center items-center content-center">
      <h1> {{server.name}}</h1>
  </div>
</template>

<script>
export default {
  async asyncData({ params }) {
    const id = params.id
    return { id };
  },

  data() {
    return {
      server: null,
    }
  },

  mounted() {
    this.loadServer();
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
