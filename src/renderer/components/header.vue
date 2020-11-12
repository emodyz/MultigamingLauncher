<template>
  <div class="flex flex-row h-40 bg-gray-900 fixed w-full" style="z-index: 10">
    <div class="flex justify-center flex-col w-full pt-2">
      <div class="border-t border-acid-green w-full"></div>
    </div>
    <span class="bg-gray-900 text-gray-900 font-bold tracking-widest page-title uppercase whitespace-no-wrap">
      {{ $nuxt.$route.name }}
    </span>
  </div>
</template>

<script>
export default {
  methods: {
    async logout () {
      await this.$auth.logout()
    }
  }

}
</script>

<style scoped>
.page-title {
  font-size: 7rem;
  text-shadow: 2px 0 0 #CCFF00, -2px 0 0 #CCFF00, 0 2px 0 #CCFF00, 0 -2px 0 #CCFF00, 1px 1px #CCFF00, -1px -1px 0 #CCFF00, 1px -1px 0 #CCFF00, -1px 1px 0 #CCFF00;
}

</style>
