<template>
  <input
    ref="input"
    class="form-input rounded-md shadow-sm border disabled:bg-gray-100 disabled:text-gray-500
     disabled:cursor-not-allowed dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
    :class="{
      'ring-red-600': error,
      'ring-1': error
    }"
    :value="value"
    @input="$emit('input', $event.target.value)"
  >
</template>

<script lang="ts">
import {
  Vue, Component, Prop, Ref
} from 'vue-property-decorator'

@Component
export default class Input extends Vue {
  @Prop({ default: 'button' }) readonly value!: string | number | boolean | null

  @Prop({ default: false }) readonly error!: boolean

  @Ref('input') readonly input!: HTMLInputElement

  focus () {
    this.input.focus()
  }
}
</script>
