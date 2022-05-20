<template>
  <iframe
    :key="isDarkMode"
    :src="'https://discord.com/widget?id='+ settings.payload.serverId + '&theme=' + (isDarkMode ? 'dark' : 'light')"
    allowtransparency="true"
    class="w-full h-auto"
    frameborder="0"
    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { themeStore } from '~/store'

@Component
export default class Discord extends Vue {
  @Prop({ required: true }) settings!: any

  get isDarkMode () {
    return themeStore.isDark
  }
}
</script>

<style scoped>

</style>
