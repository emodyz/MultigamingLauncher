<template>
  <slider :slides="news">
    <template #empty>
      <div class="flex flex-col justify-center items-center text-center w-full h-full text-gray-900 dark:text-white">
        <span class="line-1 anim-typewriter font-bold text-2xl">
          No news.
        </span>
        <span class="font-thin text-xl">
          Good news !
        </span>
      </div>
    </template>
  </slider>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import Article from '~/components/news/article.vue'
import Slider from '~/components/slider.vue'

@Component({
  components: {
    Slider
  }
})
export default class NewsSlider extends Vue {
  news: any[] = []

  maxNews: number = 7

  @Prop({ type: String, default: null }) serverId!: string | null;

  async mounted () {
    let news
    if (this.serverId) {
      news = (await this.$axios.get(`/servers/${this.serverId}/articles/latest/${this.maxNews}`)).data
    } else {
      news = (await this.$axios.get(`/articles/latest/${this.maxNews}`)).data
    }

    news.forEach((article: any) => {
      this.news.push({
        component: Article,
        data: {
          title: article.title,
          subtitle: article.subTitle,
          image: article.cover_image_url,
          content: article.content
        }
      })
    })
  }
}
</script>

<style scoped>

.line-1 {
  @apply border-r-2 border-gray-900 dark:border-white border-opacity-75;

  margin: 0 auto;
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
    @apply border-gray-500;
  }
  to {
    border-right-color: transparent;
  }
}

</style>
