<template>
  <div class="flex flex-row h-full ">
    <div class="flex w-2/3 h-auto p-4">
      <!---<div v-for="item of news" :key="item.title" class="w-full">
        <news :content="item.content" :img="item.image" :subtitle="item.subtitle" :title="item.title" class="rounded-2xl" />
      </div>-->
      <slider :slides="news">
        <template #empty>
          <div class="flex flex-col justify-center items-center text-center w-full h-full">
            <span class="text-white font-bold text-2xl">
              No news.
            </span>
            <span class="text-white font-thin text-xl">
              Is good news !
            </span>
          </div>
        </template>
      </slider>
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
          <button class="rounded border border-acid-green text-gray-400 bg-gray-900 hover:bg-gray-800 px-2 mx-2 w-full ">JOIN</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron'
import News from '@/components/news'
import Slider from '@/components/slider'

export default {
  transition: 'fade',

  components: {
    Slider,
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
      component: News,
      data: {
        title: "J'aime les brocolis",
        subtitle: 'Oh oui miam !',
        image: 'https://image.api.playstation.com/vulcan/img/cfn/11307x4B5WLoVoIUtdewG4uJ_YuDRTwBxQy0qP8ylgazLLc01PBxbsFG1pGOWmqhZsxnNkrU3GXbdXIowBAstzlrhtQ4LCI4.png',
        content: content
      }
    })
    this.news.push({
      component: News,
      data: {
        title: "Oh god Arma4 est sortie !",
        subtitle: 'Lien dans la description',
        image: 'https://i.ytimg.com/vi/TeOShkJN9Xw/maxresdefault.jpg',
        content: content
      }
    })
    this.news.push({
      component: News,
      data: {
        title: "GTA V. C'est vraiment une tuerie ! ",
        subtitle: 'Tentez de gagner une PS5',
        image: 'https://media.begeek.fr/2020/05/Epic-Games-Store-GTA-5-PC.jpg',
        content: content
      }
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
