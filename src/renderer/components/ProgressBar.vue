<template>
  <div class="relative">
    <div class="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
      <div :style="'width: ' + progress + '%'"
           class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center
           bg-gray-600 progress-animation"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";

@Component
export default class ProgressBar extends Vue {

  @Prop({type: Number, required: true, default: 0}) progress!: number;

}
</script>

<style scoped>
.progress-animation {
  transition: width 200ms;
}
</style>
