<template>
  <div class="bg-gray-50 dark:bg-gray-900 subpixel-antialiased">
    <SideBar class="slide-animation" />
    <Header :title="title" class="pl-20 slide-animation" />
    <div
      class="pl-20 h-screen w-screen overflow-y-scroll slide-animation"
      :class="{'pt-24': title}"
    >
      <div class="relative w-full h-full">
        <nuxt />
      </div>
    </div>
    <DownloaderOverlay />
  </div>
</template>

<script>
import SideBar from '~/components/SideBar'
import DownloaderOverlay from '@/components/DownloaderOverlay'
import Header from '@/components/header'
import { pageStore, themeStore } from '~/store'

export default {
  name: 'DefaultLayout',

  components: {
    Header,
    DownloaderOverlay,
    SideBar
  },

  computed: {
    title () {
      return pageStore.title
    }
  },
  beforeCreate () {
    themeStore.syncTheme()
  },
  mounted () {

  }
}
</script>

<style scoped>
.slide-animation {
  animation: slide-animation 0.5s forwards;
  left: -100px;
}

@keyframes slide-animation {
  100% {
    left: 0;
  }
}
</style>
