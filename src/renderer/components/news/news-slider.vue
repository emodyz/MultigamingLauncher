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

  @Prop({ type: String, default: null }) serverId!: string | null;

  async mounted () {
    let news
    if (this.serverId) {
      news = (await this.$axios.get(`/servers/${this.serverId}/articles`)).data
    } else {
      news = (await this.$axios.get('/articles/latest/7')).data
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
