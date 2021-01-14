<template>
  <div class="w-full h-full bg-gray-800 rounded-md" @mouseout="startAutoSlider" @mouseover="stopAutoSlider">
    <div class="relative flex justify-center w-full h-full overflow-hidden rounded-md">
      <slot v-if="sliderSlides.length === 0" name="empty" />
      <div
        v-for="(slide, index) of sliderSlides"
        v-else
        :key="index"
        :ref="'slide-' + index"
        :class="{
          'transition-all': doAnimation,
          'duration-300': doAnimation
        }"
        :style="{right: (-100 * (index - currentSlide)) + '%'}"
        class="absolute w-full h-full"
      >
        <component
          :is="slide.component"
          v-bind="slide.data"
          class="w-full h-full"
          @control="hideControl = $event"
        />
      </div>
      <transition name="fade">
        <div v-if="sliderSlides.length - 2 > 1 && !hideControl">
          <div
            class="absolute flex top-2 right-1/2 text-acid-green blurred bg-black bg-opacity-20
            rounded-full transform translate-x-1/2 "
          >
            <div v-for="(slide, index) of slides"
                 :key="index"
                 class="cursor-pointer p-2"
                 @click="goToSlide(index)"
            >
              <div
                :class="{
                  'opacity-100': isCurrentSlide(index)
                }" class="w-4 h-0 border opacity-30 rounded-full"
              />
            </div>
          </div>
          <div class="absolute right-1 top-1/2 transform -translate-y-1/2">
            <button class="w-8 h-16 p-1 rounded-full font-bold bg-gray-800 bg-opacity-20 text-white
            transition-colors blurred hover:bg-opacity-50 focus:outline-none" @click="next"
            >
              <svg class="stroke-current" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                   xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              </svg>
            </button>
          </div>
          <div class="absolute left-1 top-1/2 transform -translate-y-1/2">
            <button class="w-8 h-16 p-1 rounded-full font-bold bg-gray-800 bg-opacity-20 text-white transition-colors
             blurred hover:bg-opacity-50 focus:outline-none" @click="prev"
            >
              <svg class="stroke-current" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                   xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              </svg>
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Slider extends Vue {
  @Prop({ type: Array, required: true, default: [] }) slides!: any[];

  hideControl: boolean = false;
  currentSlide: number = 1;

  animationInProgress: boolean = false;
  doAnimation: boolean = true;

  autoSlideInterval: any = null;

  get sliderSlides () {
    const slides = [...this.slides]

    const firstSlide = slides[0]
    const lastSlide = slides[slides.length - 1]

    if (lastSlide) {
      slides.unshift(lastSlide)
    }
    if (firstSlide) {
      slides.push(firstSlide)
    }

    return slides
  }

  mounted () {
    this.startAutoSlider()
  }

  beforeDestroy () {
    this.stopAutoSlider()
  }

  isCurrentSlide (index: number) {
    if (this.currentSlide === this.sliderSlides.length - 1 && index === 0) {
      return true
    } else if (this.currentSlide === 0 && index === this.sliderSlides.length - 3) {
      return true
    }

    return index === this.currentSlide - 1
  }

  goToSlide (index: number) {
    if (this.animationInProgress) {
      return
    }

    const handleDone = this.handleShift()
    let nextSlide: number

    if (this.currentSlide === this.sliderSlides.length - 1 && index === 0) {
      nextSlide = 1
    } else if (this.currentSlide === 0 && index === this.sliderSlides.length - 3) {
      nextSlide = this.sliderSlides.length - 3
    } else {
      nextSlide = index + 1
    }

    if (nextSlide === this.currentSlide) {
      handleDone()
      return
    }

    this.currentSlide = nextSlide
  }

  next () {
    if (this.animationInProgress) {
      return
    }

    this.handleShift()
    this.currentSlide++
  }

  prev () {
    if (this.animationInProgress) {
      return
    }

    this.handleShift()
    this.currentSlide--
  }

  startAutoSlider () {
    if (this.hideControl || this.sliderSlides.length - 2 === 1) {
      return
    }

    this.autoSlideInterval = setInterval(() => {
      this.next()
    }, 3000)
  }

  stopAutoSlider () {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval)
    }
  }

  handleShift () {
    const elementMinus = this.$refs['slide-' + (this.currentSlide - 1)]
    const elementPlus = this.$refs['slide-' + (this.currentSlide + 1)]
    const self = this

    this.doAnimation = true
    this.animationInProgress = true

    function handleDone () {
      self.animationInProgress = false

      if (self.currentSlide >= self.sliderSlides.length - 1) {
        self.doAnimation = false
        self.currentSlide = 1
      } else if (self.currentSlide <= 0) {
        self.doAnimation = false
        self.currentSlide = self.sliderSlides.length - 2
      }

      if (elementMinus) {
        // @ts-ignore
        elementMinus[0].removeEventListener('transitionend', handleDone)
      }
      if (elementPlus) {
        // @ts-ignore
        elementPlus[0].removeEventListener('transitionend', handleDone)
      }
    }
    if (elementMinus) {
      // @ts-ignore
      elementMinus[0].addEventListener('transitionend', handleDone)
    }
    if (elementPlus) {
      // @ts-ignore
      elementPlus[0].addEventListener('transitionend', handleDone)
    }

    return handleDone
  }
}
</script>

<style scoped>
.blurred {
  backdrop-filter: blur(4px);
}

</style>
