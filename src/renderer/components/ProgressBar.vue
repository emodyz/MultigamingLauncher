<template>
  <div class="relative overflow-hidden">
    <div class="overflow-hidden text-xs h-full flex rounded bg-gray-200 dark:bg-gray-700">
      <div
        :style="'width: ' + progress + '%'"
        class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center
            progress-animation bg-indigo-400 dark:bg-indigo-500"
      />
    </div>
    <div v-if="$slots.default" class="absolute inset-0" >
      <slot/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class ProgressBar extends Vue {
  @Prop({ type: Number, required: true, default: 0 }) progress!: number
}
</script>

<style scoped>
.progress-animation {
  transition: width 200ms;
}
</style>
