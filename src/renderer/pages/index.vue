<template>
  <div class="bg-red">
    <button @click="openURL('https://google.com')">OK</button>
    <span v-if="user">
      {{user.name}}
    </span>
  </div>
</template>

<script>
import { remote } from 'electron'

export default {
  computed: {
    user() {
     return this.$store.state.auth.user;
    }
  },
  methods: {
    openURL (url) {
      remote.shell.openExternal(url)
    }
  }
}
</script>

<style>

</style>
