<template>
  <div class="bg-gray-900">
    <Sidebar class="slide-animation" />
    <Header :title="title" class="pl-20 slide-animation" />
    <div :class="{'pt-24': title}" class="text-gray-700 bg-gray-900 h-screen w-screen pl-20 overflow-y-scroll slide-animation">
      <div class="relative w-full h-full">
        <nuxt />
      </div>
    </div>
    <Downloader />
  </div>
</template>

<script>
import Sidebar from '@/components/sidebar'
import Downloader from '@/components/downloader'
import Header from '@/components/header'
import {pageStore} from "~/store";

export default {
  components: {
    Header,
    Downloader,
    Sidebar
  },

  computed: {
    title () {
      return pageStore.title
    }
  },
  mounted () {
    console.log(this.$echo)
    this.$echo.channel('modpacks')
      .listen('Modpack\\ModpackUpdateRequested', e => {
        console.log('event', e)
      })
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
