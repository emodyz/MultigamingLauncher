<template>
  <div v-if="title" class="fixed z-40 flex flex-row w-full bg-gray-50 dark:bg-gray-900">
    <div class="flex justify-center items-center flex-col w-full">
      <div class="border-t-4 border-gray-300 dark:border-gray-700 w-full" />
    </div>
    <div class="flex justify-center items-center ml-2 bg-gray-50 page-title dark:bg-gray-900 mr-2">
      <span
        class="font-thin tracking-wide text-gray-300 whitespace-no-wrap uppercase
      dark:page-title-dark dark:text-gray-700"
      >
        {{ title }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Header extends Vue {
  @Prop({ required: true, default: null }) title!: string | null
}
</script>

<style scoped>

.page-title {
  font-size: 4rem;
}

</style>
