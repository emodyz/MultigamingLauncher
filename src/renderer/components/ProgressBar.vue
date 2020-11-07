<template>
  <div class="relative">
    <div class="overflow-hidden h-2 text-xs flex rounded bg-teal-200">
      <div :style="'width: ' + progress + '%'" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500 progress-animation" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    progress: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>
  .progress-animation {
    transition: width 200ms;
  }
</style>
