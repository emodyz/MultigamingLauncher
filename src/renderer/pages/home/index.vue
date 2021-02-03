<template>
  <div class="flex flex-row h-full ">
    <div class="flex h-auto p-4"
         :class="{
           'w-full': voiceSettings.type === null,
           'w-2/3': voiceSettings.type !== null
         }"
    >
      <news-slider class="shadow-md border border-gray-200 dark:border-transparent" />
    </div>
    <div v-if="voiceComponent()" class="flex w-1/3  h-auto p-4">
      <component :is="voiceComponent()" class="shadow-md border border-gray-200 rounded-md dark:border-transparent"
                 :settings="voiceSettings"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { pageStore } from '@/store'
import NewsSlider from '@/components/news/news-slider.vue'
import Discord from '@/components/voices/Discord.vue'
import TeamSpeak3 from '@/components/voices/TeamSpeak3.vue'

@Component({
  transition: 'fade',
  components: {
    NewsSlider
  }
})
export default class Home extends Vue {
  news = [];
  voiceSettings = {
    type: null as string | null
  };

  get user () {
    return this.$store.state.auth.user
  }

  voiceComponent () {
    switch (this.voiceSettings.type) {
    case 'discord':
      return Discord
    case 'teamspeak3':
      return TeamSpeak3
    default:
      return null
    }
  }

  async mounted () {
    pageStore.setTitle('HOME')

    this.voiceSettings = (await this.$axios.get('/settings/voice')).data
  }
}
</script>

<style scoped>

</style>
