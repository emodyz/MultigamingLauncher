<template>
  <div
    class="min-h-screen w-full flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100
   dark:bg-gray-900"
  >
    <div>
      <slot name="logo" />
    </div>

    <div class="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg dark:bg-gray-800">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class AuthenticationCard extends Vue {

}
</script>
