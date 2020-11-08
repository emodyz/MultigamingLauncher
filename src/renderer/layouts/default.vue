<template>
  <div>
    <Sidebar>
      <nuxt />
    </Sidebar>
    <Downloader />
  </div>
</template>

<script>
import Sidebar from '@/components/sidebar'
import Downloader from '@/components/downloader'

export default {
  components: {
    Downloader,
    Sidebar
  }
}
</script>

<style>
</style>
