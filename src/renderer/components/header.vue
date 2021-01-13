<template>
  <div v-if="title" class="fixed z-40 flex flex-row h-24 w-full bg-gray-900">
    <div class="flex justify-center flex-col w-full pt-2">
      <div class="border-t border-acid-green w-full" />
    </div>
    <span class="bg-gray-900 text-gray-900 font-bold tracking-widest page-title uppercase whitespace-no-wrap ml-2">
      {{ title }}
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Header extends Vue {
  @Prop({ required: true, default: null }) title!: string | null;
}
</script>

<style scoped>
.page-title {
  font-size: 4rem;
  text-shadow: 2px 0 0 #CCFF00, -2px 0 0 #CCFF00, 0 2px 0 #CCFF00, 0 -2px 0 #CCFF00, 1px 1px #CCFF00,
  -1px -1px 0 #CCFF00, 1px -1px 0 #CCFF00, -1px 1px 0 #CCFF00;
}

</style>
