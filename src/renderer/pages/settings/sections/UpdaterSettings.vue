<template>
  <div>
    Updater page
    <div>
      Current version: {{ currentVersion }}
    </div>

    <div v-if="updateInfo">
      New Version: {{ updateInfo.version }}
    </div>

    <div v-if="!isUpdateAvailable">
      <JetButton @click="checkForUpdate">Check for updates</JetButton>
    </div>

    <div v-if="isUpdateAvailable">
      <JetButton @click="processUpdate">Update launcher</JetButton>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import JetButton from '../../../components/JetStream/Button.vue'
import { appUpdater } from '@/store'

@Component({
  components: {
    JetButton
  }
})
export default class UpdaterSettings extends Vue {
  get currentVersion () {
    return appUpdater.currentVersion
  }

  get updateInfo () {
    return appUpdater.updateInfo
  }

  get isUpdateAvailable () {
    return appUpdater.isUpdateAvailable
  }

  async checkForUpdate () {
    await appUpdater.checkForUpdate()
  }

  async processUpdate () {
    await appUpdater.processUpdate()
  }
}
</script>

<style scoped>

</style>
