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

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'

import Article from '~/components/news/article.vue'
import Slider from '~/components/slider.vue'

@Component({
  components: {
    Slider
  }
})
export default class NewsSlider extends Vue {
  news: any[] = []

  async mounted () {
    // MOCK
    const content = await fetch('https://raw.githubusercontent.com/emodyz/MultigamingLauncher/master/README.md')
      .then(res => res.text())

    this.news.push({
      component: Article,
      data: {
        title: "J'aime les brocolis",
        subtitle: 'Oh oui miam !',
        image: 'https://www.pedagojeux.fr/wp-content/uploads/2019/11/1280x720_Minecraft.jpg',
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
