<template>
  <div :style="{ 'background-image': 'url(' + image + ')' }"
       class="bg-black shadow overflow-hidden relative bg-cover bg-center w-full h-full select-none"
  >
    <div
      :class="{'overlay-opened': opened}"
      :style="{'transform': 'translateY(-' + headerSize + 'px)'}"
      class="absolute w-full h-full p-4 shadow-xl overflow-y-scroll text-white overlay"
    >
      <div id="news-header" ref="newsHeader" class="mb-2 cursor-pointer" @click="openCloseNews">
        <span v-if="title" class="font-bold w-full block text-3xl mb-2">
          {{ title }}
        </span>
        <span v-if="subtitle" class="font-light block text-xl">
          {{ subtitle }}
        </span>
      </div>
      <transition name="fade">
        <article
          v-if="opened" class="prose-sm text-white border-t border-indigo-400 border-opacity-50 pt-5"
          v-html="parsedContent"
        />
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator'
import marked from 'marked'

@Component
export default class Article extends Vue {
  @Ref() readonly newsHeader: any;

  @Prop({ type: String, required: true, default: null }) image!: string;
  @Prop({ type: String, required: true, default: null }) title!: string;
  @Prop({ type: String, default: null }) subtitle!: string | null;
  @Prop({ type: String, required: true, default: null }) content!: string;

  opened: boolean = false;
  headerSize: number = 0;
  resizeHeaderTimeout: any = null;

  get parsedContent () {
    return marked(this.content)
  }

  mounted () {
    this.resizeHeader()
  }

  created () {
    window.addEventListener('resize', this.resizeHeader)
  }

  destroyed () {
    window.removeEventListener('resize', this.resizeHeader)
  }

  beforeDestroy () {
    if (this.resizeHeaderTimeout) {
      clearTimeout(this.resizeHeaderTimeout)
    }
  }

  resizeHeader () {
    if (this.resizeHeaderTimeout) {
      clearTimeout(this.resizeHeaderTimeout)
    }
    this.resizeHeaderTimeout = setTimeout(() => {
      this.headerSize = this.newsHeader.clientHeight + 30
    }, 300)
  }

  openCloseNews () {
    this.opened = !this.opened

    if (this.opened) {
      this.$emit('control', true)
    } else {
      this.$emit('control', false)
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
