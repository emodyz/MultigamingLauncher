<template>
  <div class="w-full h-full bg-gray-800 rounded-md">
    <div class="relative flex justify-center w-full h-full overflow-hidden rounded-md">
      <div
        v-for="(slide, index) of sliderSlides"
        :ref="'slide-' + index"
        :class="{
              'transition-all': doAnimation,
              'duration-300': doAnimation
            }"
        :style="{right: (-100 * (index - currentSlide)) + '%'}"
        class="absolute w-full h-full">
        <component :is="slide.component" v-bind="slide.data" class="w-full h-full"></component>
      </div>
      <div v-if="slides.length > 1">
        <div class="absolute right-1 top-1/2">
          <button class="font-bold bg-gray-800 text-white rounded-full p-2" @click="next">
            <svg class="stroke-current text-white w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                 xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            </svg>
          </button>
        </div>
        <div class="absolute left-1 top-1/2">
          <button class="font-bold bg-gray-800 text-white rounded-full p-2" @click="prev">
            <svg class="stroke-current text-white w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                 xmlns="http://www.w3.org/2000/svg">
              <path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {

  props: {
    slides: {
      type: Array,
      default: []
    }
  },

  watch: {
    slides() {
      const slides = [...this.slides];

      const firstSlide = slides[0];
      const lastSlide = slides[slides.length - 1];

      slides.unshift(lastSlide);
      slides.push(firstSlide);

      this.sliderSlides = slides;
    }
  },

  data() {
    return {
      currentSlide: 1,

      sliderSlides: [],

      needToShift: false,

      animationInProgress: false,
      doAnimation: true,
    }
  },

  methods: {

    next() {
      if (this.animationInProgress) {
        return;
      }

      const element = this.$refs['slide-' + (this.currentSlide - 1)][0];
      const self = this;

      function handleDone() {
        self.animationInProgress = false;

        if (self.currentSlide >= self.sliderSlides.length - 1) {
          self.doAnimation = false;
          self.currentSlide = 1;
        }

        element.removeEventListener('transitionend', handleDone);
      }

      element.addEventListener('transitionend', handleDone);

      this.doAnimation = true;
      this.animationInProgress = true;
      this.currentSlide++;
    },

    prev() {
      if (this.animationInProgress) {
        return;
      }

      const element = this.$refs['slide-' + (this.currentSlide + 1)][0];
      const self = this;

      function handleDone() {
        self.animationInProgress = false;

        if (self.currentSlide <= 0) {
          self.doAnimation = false;
          self.currentSlide = self.sliderSlides.length - 2;
        }

        element.removeEventListener('transitionend', handleDone);
      }

      element.addEventListener('transitionend', handleDone);

      this.doAnimation = true;
      this.animationInProgress = true;
      this.currentSlide--;
    }
  }
}
</script>

<style scoped>


</style>
