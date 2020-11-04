<template>
  <div class="flex flex-content-center items-center justify-center flex-col">
    <span>Welcome !</span>
    <span v-if="user" class="font-bold">
      {{ user.name }}
    </span>
  </div>
</template>

<script>
import {remote} from 'electron'

export default {
  computed: {
    user () {
      return this.$store.state.auth.user
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
