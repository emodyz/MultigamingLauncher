<template>
  <button
    class="ml-2 w-7 h-7 bg-gray-200
          rounded-md text-gray-500 hover:text-gray-900 flex justify-center items-center
          hover:bg-gray-300 focus:outline-none dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-300"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'ActionButton'
}
</script>

<style scoped>

</style>
