<template>
  <div v-if="title" class="fixed z-40 flex flex-row h-24 w-full bg-gray-50 dark:bg-gray-900">
    <div class="flex justify-center flex-col w-full pt-2">
      <div class="border-t border-gray-300 dark:border-indigo-400 w-full" />
    </div>
    <span class="bg-gray-50 text-gray-50 font-bold tracking-widest page-title uppercase whitespace-no-wrap
    ml-2 dark:text-gray-900 dark:bg-gray-900"
    >
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
  -webkit-text-stroke: 2px theme('colors.indigo.400');
}

</style>
