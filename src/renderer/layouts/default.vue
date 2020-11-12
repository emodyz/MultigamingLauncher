<template>
  <div class="bg-gray-900">
    <Sidebar class="fixed h-full slide-animation z-20"/>
    <Header class="pl-20 slide-animation" />
    <nuxt class="text-gray-700 bg-gray-900 h-screen w-screen pl-20 pt-40 relative overflow-y-scroll slide-animation" />
    <Downloader />
  </div>
</template>

<script>
import Sidebar from '@/components/sidebar'
import Downloader from '@/components/downloader'
import Header from "@/components/header";

export default {
  components: {
    Header,
    Downloader,
    Sidebar
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
