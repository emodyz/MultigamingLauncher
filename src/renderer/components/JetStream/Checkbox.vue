<template>
  <input v-model="checked" type="checkbox"
         class="appearance-none h-6 w-6 border border-gray-200 rounded-md checked:bg-indigo-400
         checked:border-transparent focus:outline-none dark:border-transparent dark:bg-gray-800 dark:border-gray-700"
  >
</template>

<script lang="ts">
import { Component, VModel, Vue } from 'vue-property-decorator'

@Component
export default class Checkbox extends Vue {
  @VModel() checked;
}
</script>
