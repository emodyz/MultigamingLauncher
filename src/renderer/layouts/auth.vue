<template>
  <nuxt />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { themeStore } from '~/store'

@Component({

})
export default class AuthLayout extends Vue {
  beforeCreate () {
    themeStore.syncTheme()
  }
}
</script>

<style>
</style>
