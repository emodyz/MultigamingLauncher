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
      <JetButton :disabled="isUpdateInProgress" @click="checkForUpdate">Check for updates</JetButton>
    </div>

    <div v-if="isUpdateAvailable">
      <JetButton :disabled="isUpdateInProgress" @click="processUpdate">
        {{ isUpdateInProgress ? 'Updating...' : 'Update launcher' }}
      </JetButton>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import JetButton from '../../../components/JetStream/Button.vue'
import { appUpdaterStore } from '@/store'

@Component({
  components: {
    JetButton
  }
})
export default class UpdaterSettings extends Vue {
  get currentVersion () {
    return appUpdaterStore.currentVersion
  }

  get updateInfo () {
    return appUpdaterStore.updateInfo
  }

  get isUpdateAvailable () {
    return appUpdaterStore.isUpdateAvailable
  }

  get isUpdateInProgress () {
    return appUpdaterStore.isUpdateInProgress
  }

  async checkForUpdate () {
    await appUpdaterStore.checkForUpdate()
  }

  async processUpdate () {
    await appUpdaterStore.processUpdate()
  }
}
</script>

<style scoped>

</style>
