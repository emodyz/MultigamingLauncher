<template>
  <input v-model="checked" type="checkbox"
         class="form-checkbox"
  >
</template>

<script lang="ts">
import { Component, VModel, Vue } from 'vue-property-decorator'

@Component
export default class Checkbox extends Vue {
  @VModel() checked;
}
</script>
