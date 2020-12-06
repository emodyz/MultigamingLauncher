<template>
  <div :style="{ 'background-image': 'url(' + img + ')' }"
       class="bg-black shadow overflow-hidden relative bg-cover w-full h-full select-none">
    <div
      :class="{'overlay-opened': opened}"
      :style="{'transform': 'translateY(-' + headerSize + 'px)'}"
      class="absolute w-full h-full p-4 shadow-xl overflow-scroll text-white overlay">
      <div id="news-header" ref="newsHeader" class="mb-2 cursor-pointer" @click="opened = !opened">
        <span v-if="title" class="font-bold w-full block text-3xl mb-2">
          {{ title }}
        </span>
        <span v-if="subtitle" class="font-light block text-xl">
          {{ subtitle }}
        </span>
      </div>
      <transition name="fade">
        <article v-if="opened && parsedContent" class="prose-sm text-white border-t border-acid-green border-opacity-50 pt-5" v-html="parsedContent" />
      </transition>
    </div>
  </div>
</template>

<script>
import marked from 'marked'

export default {
  props: {
    img: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    subtitle: {
      type: String,
      default: null
    },
    content: {
      type: String,
      default: null
    }
  },

  data () {
    return {
      opened: false,
      headerSize: 0
    }
  },

  computed: {
    parsedContent () {
      return marked(this.content)
    }
  },

  created () {
    window.addEventListener('resize', this.resizeHeader)
  },

  destroyed () {
    window.removeEventListener('resize', this.resizeHeader)
  },

  mounted () {
    this.resizeHeader()
  },

  methods: {
    resizeHeader () {
      this.headerSize = this.$refs.newsHeader.clientHeight + 30
    }
  }

}
</script>

<style scoped>
  .overlay {
    transition: all 400ms ease-in-out;
    backdrop-filter: blur(4px);
    bottom: -100%;
  }

  .overlay-opened {
    background: rgba(0,0,0,0.5);

    transform: none !important;
    bottom: 0;
    left: 0;
    right: 0;
  }

</style>
