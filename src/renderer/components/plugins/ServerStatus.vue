<template>
  <div v-if="server" class="p-2 relative rounded-md h-full">
    <div v-if="server.status.online" class="absolute rounded-tr-md rounded-bl-md top-0 right-0 px-1 py-0.5 text-xs
     bg-green-400 text-green-50 dark:text-green-900 dark:bg-green-300"
    >
      Online
    </div>
    <div v-else-if="!server.status.online" class="absolute rounded-tr-md rounded-bl-md top-0 right-0 px-1 py-0.5
    text-xs bg-red-400 text-red-50 dark:text-red-900 dark:bg-red-300"
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
          |
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
  @Prop({ required: true }) !server;
}
</script>

<style scoped>

</style>
