<template>
  <Sidebar>
    <Downloader></Downloader>
    <nuxt />
  </Sidebar>
</template>

<script>
import Header from '@/components/header'
import Sidebar from '@/components/sidebar'
import Downloader from "@/components/downloader";

export default {
  components: {
    Downloader,
    Header,
    Sidebar
  }
}
</script>

<style>
</style>
