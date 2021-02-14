<template>
  <div>
    <div class="w-full border-b w-full pb-4 dark:border-gray-700">
      <span class="text-xl">
        Theme
      </span>
    </div>
    <div class="flex flex-col justify-center items-center mt-4">
      <span class="text-sm">
        Choose how this Launcher looks to you. Set your theme preference to follow your system settings,
        or choose to use the light or dark theme.
      </span>
      <div class="flex mt-4">
        <div class="relative w-40 h-28 border border-gray-200 rounded-md mx-2 cursor-pointer dark:border-gray-700"
             @click="setThemeSource('system')"
        >
          <img src="~/assets/images/appearances/color_mode_auto.svg" class="rounded-t-md">
          <div class="absolute flex items-center w-full h-7 left-0 right-0 bottom-0 rounded-b-md px-2">
            <input type="radio" class="w-3 h-3 transform translate-y-0.5" :checked="themeSource === 'system'" disabled>
            <span class="ml-2">
              System
            </span>
          </div>
        </div>
        <div class="relative w-40 h-28 border border-gray-200 rounded-md mx-2 cursor-pointer dark:border-gray-700"
             @click="setThemeSource('light')"
        >
          <img src="~/assets/images/appearances/color_mode_light.svg" class="rounded-t-md">
          <div class="absolute flex items-center  w-full h-7 left-0 right-0 bottom-0 rounded-b-md px-2">
            <input type="radio" class="w-3 h-3 transform translate-y-0.5" :checked="themeSource === 'light'" disabled>
            <span class="ml-2">
              Light
            </span>
          </div>
        </div>
        <div class="relative w-40 h-28 border border-gray-200 rounded-md mx-2 cursor-pointer dark:border-gray-700"
             @click="setThemeSource('dark')"
        >
          <img src="~/assets/images/appearances/color_mode_dark.svg" class="rounded-t-md">
          <div class="absolute flex items-center w-full h-7 left-0 right-0 bottom-0 rounded-b-md px-2">
            <input type="radio" class="w-3 h-3 transform translate-y-0.5" :checked="themeSource === 'dark'" disabled>
            <span class="ml-2">
              Dark
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { themeStore } from '~/store'

@Component
export default class AppearanceSettings extends Vue {
  get themeSource () {
    return themeStore.themeSource
  }

  setThemeSource (source: 'system'|'dark'|'light') {
    themeStore.setThemeSource(source)
  }
}
</script>

<style scoped>

</style>
