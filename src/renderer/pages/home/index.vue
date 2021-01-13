<template>
  <div class="flex flex-row h-full ">
    <div class="flex w-2/3 h-auto p-4">
      <news-slider />
    </div>
    <div class="flex w-1/3  h-auto p-4">
      <iframe
        v-if="voice.type === 'discord'"
        :src="'https://discord.com/widget?id='+ voice.server.id + '&theme=dark'"
        allowtransparency="true"
        class="w-full h-auto"
        frameborder="0"
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
      />
      <div v-if="voice.type === 'teamspeak'" class="flex flex-col w-full justify-center items-center">
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
import NewsSlider from '@/components/news/news-slider'
import { pageStore } from '@/store'

@Component({
  transition: 'fade',
  components: {
    NewsSlider
  }
})
export default class Home extends Vue {
  news = [];
  voice = {
    type: 'discord',
    server: {
      id: '137612119536304128'
    }
  };

  get user () {
    return this.$store.state.auth.user
  }

  mounted () {
    pageStore.setTitle('HOME')
  }
}
</script>

<style scoped>

</style>
