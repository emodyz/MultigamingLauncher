<template>
  <div class="flex flex-row h-full ">
    <div class="flex  h-auto p-4"
         :class="{
           'w-full': voiceSettings.type === null,
           'w-2/3': voiceSettings.type !== null
         }"
    >
      <news-slider />
    </div>
    <div v-if="voiceSettings.type !== null" class="flex w-1/3  h-auto p-4">
      <iframe
        v-if="voiceSettings.type === 'discord'"
        :src="'https://discord.com/widget?id='+ voiceSettings.payload.serverId + '&theme=dark'"
        allowtransparency="true"
        class="w-full h-auto"
        frameborder="0"
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
      />
      <div v-else-if="voiceSettings.type === 'teamspeak3'" class="flex flex-col w-full justify-center items-center">
        <img class="w-32" src="https://upload.wikimedia.org/wikipedia/commons/e/ec/TeamSpeak_logo_renovado.png">
        <div class="mt-4 w-full">
          <button class="rounded border border-acid-green text-gray-400 bg-gray-900 hover:bg-gray-800 px-2 mx-2 w-full">
            JOIN
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { pageStore } from '@/store'
import NewsSlider from '@/components/news/news-slider.vue'

@Component({
  transition: 'fade',
  components: {
    NewsSlider
  }
})
export default class Home extends Vue {
  news = [];
  voiceSettings = {
    type: null
  };

  get user () {
    return this.$store.state.auth.user
  }

  async mounted () {
    pageStore.setTitle('HOME')

    this.voiceSettings = (await this.$axios.get('/settings/voice')).data
  }
}
</script>

<style scoped>

</style>
