<template>
  <div v-show="message">
    <p class="text-sm text-red-600 mt-1">
      {{ Array.isArray(message) ? message[0] : message }}
    </p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class InputError extends Vue {
  @Prop() readonly message!: any
}
</script>
