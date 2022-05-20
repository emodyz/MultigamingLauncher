<template>
  <div v-if="server" class="p-2 relative rounded-md h-full">
    <div
      v-if="server.status.online" class="absolute rounded-tr-md rounded-bl-md top-0 right-0 px-2 py-1 text-xs
     bg-green-100 text-green-800 dark:text-emerald-300 dark:bg-emerald-900"
    >
      Online
    </div>
    <div
      v-else-if="!server.status.online" class="absolute rounded-tr-md rounded-bl-md top-0 right-0 px-2 py-1
    text-xs bg-red-500 text-white dark:text-gray-300 dark:bg-red-900 "
    >
      Offline
    </div>

    <div class="w-full h-full flex flex-col justify-center items-center">
      <span class="text-2xl font-thin">
        Players
      </span>
      <div class="flex justify-evenly whitespace-nowrap text-6xl w-full mt-10">
        <span>
          {{ server.status.players_online }}
        </span>
        <span>
          /
        </span>
        <span>
          {{ server.status.players_max }}
        </span>
      </div>
      <div class="flex justify-evenly whitespace-nowrap text-gray-400 font-thin w-full mt-4">
        <span>
          Online
        </span>
        <span />
        <span>
          Max
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class ServerStatus extends Vue {
  @Prop({ required: true }) !server
}
</script>

<style scoped>

</style>
