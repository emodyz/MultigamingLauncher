<template>
  <div class="flex flex-row h-full ">
    <div class="flex w-2/3 h-auto p-4">
        <div v-for="item of news" :key="item.title" class="w-full">
          <news :content="item.content" :img="item.image" :subtitle="item.subtitle" :title="item.title" class="rounded-2xl" />
        </div>
    </div>
    <div class="flex w-1/3  h-auto p-4">
      <iframe
        v-if="voice.type === 'discord'"
        :src="'https://discord.com/widget?id='+ voice.server.id + '&theme=dark'"
        allowtransparency="true"
        class="w-full h-auto"
        frameborder="0"
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"/>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron'
import News from '@/components/news'

export default {
  transition: 'fade',

  components: {
    News
  },

  data () {
    return {
      news: [],
      voice: {
        type: 'discord',
        server: {
          id: '137612119536304128'
        }
      }
    }
  },

  computed: {
    user () {
      return this.$store.state.auth.user
    }
  },

  async mounted () {
    this.$store.commit('page/setTitle', 'HOME')

    // MOCK
    const content = await fetch('https://raw.githubusercontent.com/emodyz/MultigamingLauncher/master/README.md').then(res => res.text())
    this.news.push({
      title: "J'aime les brocolis",
      subtitle: 'Oh oui miam !',
      image: 'https://image.api.playstation.com/vulcan/img/cfn/11307x4B5WLoVoIUtdewG4uJ_YuDRTwBxQy0qP8ylgazLLc01PBxbsFG1pGOWmqhZsxnNkrU3GXbdXIowBAstzlrhtQ4LCI4.png',
      content
    })
    return;
    this.news.push({
      title: "J'aime les brocolis 2",
      subtitle: 'Oh oui miam !',
      image: 'https://image.api.playstation.com/vulcan/img/cfn/11307x4B5WLoVoIUtdewG4uJ_YuDRTwBxQy0qP8ylgazLLc01PBxbsFG1pGOWmqhZsxnNkrU3GXbdXIowBAstzlrhtQ4LCI4.png',
      content
    })
    this.news.push({
      title: "J'aime les brocolis 3",
      subtitle: 'Oh oui miam !',
      image: 'https://image.api.playstation.com/vulcan/img/cfn/11307x4B5WLoVoIUtdewG4uJ_YuDRTwBxQy0qP8ylgazLLc01PBxbsFG1pGOWmqhZsxnNkrU3GXbdXIowBAstzlrhtQ4LCI4.png',
      content
    })
  },

  methods: {
    openURL (url) {
      remote.shell.openExternal(url)
    }
  }
}
</script>

<style>

</style>
