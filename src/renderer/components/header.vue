<template>
  <div v-if="title" class="fixed z-40 flex flex-row w-full bg-gray-50 dark:bg-gray-900">
    <div class="flex justify-center items-center flex-col w-full">
      <div class="border-t border-gray-300 dark:border-indigo-400 w-full" />
    </div>
    <div class="flex justify-center items-center ml-2 bg-gray-50 page-title dark:bg-gray-900 mr-2">
      <span class="font-bold tracking-wide text-gray-50 whitespace-no-wrap uppercase
      dark:page-title-dark dark:text-gray-900"
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
  @Prop({ required: true, default: null }) title!: string | null;
}
</script>

<style scoped>

.page-title {
  font-size: 4rem;
  text-shadow: 2px 0 0 theme('colors.gray.300'), -2px 0 0 theme('colors.gray.300'),
  0 2px 0 theme('colors.gray.300'), 0 -2px 0 theme('colors.gray.300'), 1px 1px theme('colors.gray.300'),
  -1px -1px 0 theme('colors.gray.300'), 1px -1px 0 theme('colors.gray.300'), -1px 1px 0 theme('colors.gray.300');
}

@layer utilities {
  @variants dark {
    .page-title-dark {
      text-shadow: 2px 0 0 theme('colors.indigo.400'), -2px 0 0 theme('colors.indigo.400'),
      0 2px 0 theme('colors.indigo.400'), 0 -2px 0 theme('colors.indigo.400'), 1px 1px theme('colors.indigo.400'),
      -1px -1px 0 theme('colors.indigo.400'), 1px -1px 0 theme('colors.indigo.400'),
      -1px 1px 0 theme('colors.indigo.400');
    }
  }
}

</style>
