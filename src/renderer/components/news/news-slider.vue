<template>
  <slider :slides="news">
    <template #empty>
      <div class="flex flex-col justify-center items-center text-center w-full h-full">
        <span class="line-1 anim-typewriter text-white font-bold text-2xl">
          No news.
        </span>
        <span class="text-white font-thin text-xl">
          Good news !
        </span>
      </div>
    </template>
  </slider>
</template>

<script>
import Slider from '@/components/slider'
import Article from '@/components/news/article'

export default {
  components: { Slider },
  data () {
    return {
      news: []
    }
  },

  async mounted () {
    // MOCK
    const content = await fetch('https://raw.githubusercontent.com/emodyz/MultigamingLauncher/master/README.md').then(res => res.text())

    this.news.push({
      component: Article,
      data: {
        title: "J'aime les brocolis",
        subtitle: 'Oh oui miam !',
        image: 'https://image.api.playstation.com/vulcan/img/cfn/11307x4B5WLoVoIUtdewG4uJ_YuDRTwBxQy0qP8ylgazLLc01PBxbsFG1pGOWmqhZsxnNkrU3GXbdXIowBAstzlrhtQ4LCI4.png',
        content
      }
    })
    this.news.push({
      component: Article,
      data: {
        title: 'Oh god Arma4 est sortie !',
        subtitle: 'Lien dans la description',
        image: 'https://i.ytimg.com/vi/TeOShkJN9Xw/maxresdefault.jpg',
        content
      }
    })
    this.news.push({
      component: Article,
      data: {
        title: "GTA V. C'est vraiment une tuerie ! ",
        subtitle: 'Tentez de gagner une PS5',
        image: 'https://media.begeek.fr/2020/05/Epic-Games-Store-GTA-5-PC.jpg',
        content
      }
    })
  }
}
</script>

<style scoped>

.line-1 {
  margin: 0 auto;
  border-right: 2px solid rgba(255, 255, 255, .75);
  font-size: 180%;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
}

/* Animation */
.anim-typewriter {
  animation: typewriter 0.7s steps(7) .5s 1 normal both,
  blinkTextCursor 500ms steps(7) infinite normal;
}

@keyframes typewriter {
  from {
    width: 0;
  }
  to {
    width: 5em;
  }
}

@keyframes blinkTextCursor {
  from {
    border-right-color: rgba(255, 255, 255, .75);
  }
  to {
    border-right-color: transparent;
  }
}

</style>
